/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * nnadhocble_pwa from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 22. 오후 1:04
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import { action, observable, reaction } from 'mobx'
import * as CocoSsd from '@tensorflow-models/coco-ssd'
import { createRef, RefObject } from 'react'
import {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  VideoTexture,
  WebGLRenderer
} from 'three'

class HomeStore {
  @observable bleAvailable = false
  @observable localVideoTrack: MediaStreamTrack[] | null = null
  @observable localAudioTrack: MediaStreamTrack[] | null = null
  @observable predicted: CocoSsd.DetectedObject[] = []

  @observable renderer: WebGLRenderer | null = null
  @observable scene: Scene = new Scene()
  @observable texture: VideoTexture | null = null
  @observable material: MeshBasicMaterial | null = null
  @observable mesh: Mesh | null = null
  @observable camera: PerspectiveCamera | null = null
  @observable geometry: PlaneBufferGeometry = new PlaneBufferGeometry()


  cameraView: RefObject<HTMLVideoElement> = createRef()
  canvasView: RefObject<HTMLCanvasElement> = createRef()
  model: CocoSsd.ObjectDetection | null = null

  constructor() {
  }

  @action
  async detectFromVideoFrame() {
    if (!this.cameraView.current || !this.model) return
    try {
      this.predicted = await this.model?.detect(this.cameraView.current!!)
      this.drawDetectedObjects(this.predicted)
      if (this.scene && this.camera)
        this.renderer?.render(this.scene, this.camera)
      requestAnimationFrame(() => {
        this.detectFromVideoFrame()
      })
    } catch (e) {}
  }

  drawDetectedObjects(predictions: CocoSsd.DetectedObject[]) {
    const canv = this.canvasView.current
    const ctx = canv?.getContext('2d')
    const gl = canv?.getContext('webgl2')
    if (!canv || !ctx) return
    gl?.clearColor(0, 0, 0, 0)
    gl?.clear(gl.COLOR_BUFFER_BIT)
    ctx.clearRect(0, 0, canv.width, canv.height)

    if (predictions.length === 0) return
    ctx.font = '24px helvetica'
    predictions.forEach((p) => {
      ctx.lineWidth = 1
      ctx.strokeStyle = '#FF0000'
      ctx.strokeRect(...p.bbox)
      ctx.fillStyle = '#00FF00'
      ctx.fillText(
        `${p.score.toFixed(3)} ${p.class}`,
        p.bbox[0],
        p.bbox[1] > 10 ? p.bbox[1] - 5 : 10
      )
    })
  }
}

export const homeStore = new HomeStore()
