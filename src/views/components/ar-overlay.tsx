/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 24. 오후 12:51
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import React from 'react'
import { DetectedObject } from '@tensorflow-models/coco-ssd'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../infra/constants'
import { observer } from 'mobx-react-lite'
import { ARGLFTEntity, ARScene } from './aframe-components'

export const AROverlay: React.FC<{
  modelUrl: string,
  objects: DetectedObject[]
  style?: React.CSSProperties,
}> = observer(({ modelUrl, style, objects }) => (
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
))
