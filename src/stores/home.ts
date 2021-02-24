/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 24. 오전 10:06
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import { makeAutoObservable } from 'mobx'
import { DetectedObject, ObjectDetection } from '@tensorflow-models/coco-ssd'
import { createRef, RefObject } from 'react'

class HomeStore {
  bleAvailable = false
  localVideoTrack: MediaStreamTrack[] | null = null
  localAudioTrack: MediaStreamTrack[] | null = null
  predicted: DetectedObject[] = []

  cameraView: RefObject<HTMLVideoElement> = createRef()
  model: ObjectDetection | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async detectFromVideoFrame() {
    if (!this.cameraView.current || !this.model) return
    try {
      this.model?.detect(this.cameraView.current!!)?.then((ps) => this.predicted = ps)
      requestAnimationFrame((time) => {
        this.detectFromVideoFrame()
      })
    } catch (e) {
      console.log(e)
    }
  }
}

export const homeStore = new HomeStore()
