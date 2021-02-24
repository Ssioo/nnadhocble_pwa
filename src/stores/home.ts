/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 24. 오전 10:06
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import { action, observable } from 'mobx'
import { ObjectDetection, DetectedObject } from '@tensorflow-models/coco-ssd'
import { createRef, RefObject } from 'react'

class HomeStore {
  @observable bleAvailable = false
  @observable localVideoTrack: MediaStreamTrack[] | null = null
  @observable localAudioTrack: MediaStreamTrack[] | null = null
  @observable predicted: DetectedObject[] = []

  cameraView: RefObject<HTMLVideoElement> = createRef()
  model: ObjectDetection | null = null

  @action
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
