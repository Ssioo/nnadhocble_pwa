import React from 'react'
import { DetectedObject } from '@tensorflow-models/coco-ssd'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../infra/constants'


export const AROverlay: React.FC<{
  modelUrl: string,
  objects: DetectedObject[]
  style?: React.CSSProperties,
}> = ({ modelUrl, style, objects }) => {

  const getArHtml = (modelUrl: string, objects: DetectedObject[]): string => {
    const result = `
      <a-scene vr-mode-ui="enabled: false;" embedded style="display: block; position: relative; height: 100%; width: 100%;">
          ${objects.map((o) =>
      `<a-gltf-model src="${modelUrl}" scale="2 2 2" position="${o.bbox[0] / WINDOW_WIDTH - 0.5} ${o.bbox[1] / WINDOW_HEIGHT - 0.5} ${-50 * WINDOW_WIDTH / o.bbox[2]}" />`
    ).join('')}
      </a-scene>`
    console.log(result)
    return result
  }

  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{ __html: getArHtml(modelUrl, objects) }}
    />
  )
}
