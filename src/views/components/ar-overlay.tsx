import React from 'react'
import { DetectedObject } from '@tensorflow-models/coco-ssd'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../infra/constants'
import { observer } from 'mobx-react-lite'
import { ARGLFTEntity, ARScene } from './aframe-components'

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
    </div>
  )
})
