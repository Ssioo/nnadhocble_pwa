import React from 'react'
import { DetectedObject } from '@tensorflow-models/coco-ssd'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../infra/constants'

const AR_HTML = (modelUrl: string, objects: DetectedObject[]) => `
<a-scene vr-mode-ui="enabled: false;" embedded style="display: block; position: relative; height: 100%; width: 100%;">
    ${objects.map((o) => 
      `<a-gltf-model src="${modelUrl}" scale="2 2 2" position="${o.bbox[0] / WINDOW_WIDTH} ${o.bbox[1] / WINDOW_HEIGHT} ${-50 * o.bbox[2] / WINDOW_WIDTH}" />`
    ).join('')}
</a-scene>`

export const AROverlay: React.FC<{
  modelUrl: string,
  objects: DetectedObject[]
  style?: React.CSSProperties,
}> = ({ modelUrl, style, objects }) => {
  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{ __html: AR_HTML(modelUrl, objects) }}
    />
  )
}
