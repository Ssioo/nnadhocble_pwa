import React from 'react'
import { observer } from 'mobx-react-lite'

const AR_HTML = (modelUrl: string) => `
<a-scene vr-mode-ui="enabled: false;" embedded style="display: block; position: relative; height: 100%; width: 100%;">
    <a-entity gltf-model="${modelUrl}" scale="2 2 2" position="0 0 -50" />
</a-scene>`

export const AROverlay: React.FC<{
  modelUrl: string,
  style?: React.CSSProperties,
}> = observer(({ modelUrl, style }) => {
  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{ __html: AR_HTML(modelUrl) }}
    />
  )
})
