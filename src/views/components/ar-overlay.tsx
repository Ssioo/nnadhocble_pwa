import React from 'react'
import { DetectedObject } from '@tensorflow-models/coco-ssd'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../infra/constants'
import ReactHtmlParser from 'react-html-parser'
import { observer } from 'mobx-react-lite'

const getArHtml = (modelUrl: string, objects: DetectedObject[]): string => {
  const result = `
      <a-scene
        vr-mode-ui="enabled: false;"
        embedded style="display: block; position: relative; height: 100%; width: 100%;"
        renderer="logarithmicDepthBuffer: true;"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: true;"
       >
          ${objects.map((o) =>
    `<a-gltf-model
                src="${modelUrl}"
                scale="2 2 2"
                position="${(o.bbox[0] / WINDOW_WIDTH - 0.5) * 20} ${(o.bbox[1] / WINDOW_HEIGHT - 0.5) * 20} ${-50 * WINDOW_WIDTH / o.bbox[2]}"
            />`
  ).join('')}
      </a-scene>`
  console.log(result)
  return result
}

interface Coord {
  x: number
  y: number
  z: number
}

const ARScene: React.FC = (props) => (
  React.createElement(
    'a-scene',
    {
      'vr-mode-ui': 'enabled: false;',
      embedded: true,
      style: {
        display: 'block',
        position: 'relative',
        height: '100%',
        width: '100%',
      },
      renderer: 'logarithmicDepthBuffer: true;',
      arjs: 'trackingMethod: best; sourceType: webcam; debugUIEnabled: true;'
    },
    props.children
  )
)

const ARGLFTEntity: React.FC<{
  src: string,
  position: Coord,
  scale?: Coord
}> = ({ src, position, scale, children }) => {
  return React.createElement(
    'a-glft-model',
    {
      src: src,
      scale: scale ? `${scale.x} ${scale.y} ${scale.z}` : undefined,
      position: `${position.x} ${position.y} ${position.z}`
    },
    children
  )
}

export const AROverlay: React.FC<{
  modelUrl: string,
  objects: DetectedObject[]
  style?: React.CSSProperties,
}> = observer(({ modelUrl, style, objects }) => {
  return (
    <div style={style}>
      <ARScene>
        {objects.map((o, idx) =>
          <ARGLFTEntity
            key={idx.toString()}
            src={modelUrl}
            position={{
              x: (o.bbox[0] / WINDOW_WIDTH - 0.5) * 20,
              y: (o.bbox[1] / WINDOW_HEIGHT - 0.5) * 20,
              z: -50 * WINDOW_WIDTH / o.bbox[2],
            }}
            scale={{ x: 2, y: 2, z: 2 }}
          />
        )}
      </ARScene>
      {/*{ReactHtmlParser(getArHtml(modelUrl, objects))}*/}
    </div>
  )
})
