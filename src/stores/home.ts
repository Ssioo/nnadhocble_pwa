/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * nnadhocble_pwa from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 22. 오후 1:04
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import { makeAutoObservable, reaction } from 'mobx'
import * as CocoSsd from '@tensorflow-models/coco-ssd'
import { useRef } from 'react'

class HomeStore {
  bleAvailable = false
  localVideoTrack: MediaStreamTrack[] | null = null
  localAudioTrack: MediaStreamTrack[] | null = null
  predicted: CocoSsd.DetectedObject[] = []

  cameraView = useRef<HTMLVideoElement | null>(null)
  canvasView = useRef<HTMLCanvasElement | null>(null)
  model = useRef<CocoSsd.ObjectDetection | null>(null)

  constructor() {
    makeAutoObservable(this)
    reaction(() => this.predicted, (ps) => {
      const canv = this.canvasView.current
      const ctx = canv?.getContext('2d')
      if (!canv || !ctx) return
      ctx.clearRect(0, 0, canv.width, canv.height)
      if (ps.length === 0) return
      ctx.font = '24px helvetica'
      ps.forEach((p) => {
        ctx.lineWidth = 1
        ctx.strokeStyle = '#FF0000'
        ctx.strokeRect(...p.bbox)
        ctx.fillStyle = 'green'
        ctx.fillText(
          `${p.score.toFixed(3)} ${p.class}`,
          p.bbox[0],
          p.bbox[1] > 10 ? p.bbox[1] - 5 : 10
        )
      })
    })
  }

  detectFromVideoFrame() {
    if (!this.cameraView.current || !this.model.current) return
    this.model.current?.detect(this.cameraView.current).then((predictions) => {
      homeStore.predicted = predictions
      requestAnimationFrame(() => {
        this.detectFromVideoFrame()
      })
    })
  }
}

export const homeStore = new HomeStore()
