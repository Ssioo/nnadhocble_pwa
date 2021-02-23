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
  BufferGeometry, Line,
  Material,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene, Vector3,
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

  @action
  async detectFromVideoFrame() {
    if (!this.cameraView.current || !this.model) return
    try {
      const predictions = await this.model?.detect(this.cameraView.current!!)
      this.predicted = predictions
      if (this.camera) {
        this.drawDetectedObjects(predictions)
        this.renderer?.render(this.scene, this.camera)
        console.log('Frame Updated')
      }
      requestAnimationFrame((time) => {
        this.detectFromVideoFrame()
      })
    } catch (e) {
      console.log(e)
    }
  }

  drawDetectedObjects(predictions: CocoSsd.DetectedObject[]) {
    predictions.map((p) => {
      const geo = new BufferGeometry().setFromPoints([
        new Vector3(-10, 0, 0),
        new Vector3(0, 10, 0),
        new Vector3(10, 0, 0),
      ])
      const line = new Line(geo, )

    })

    this.scene.add()

    /*if (predictions.length === 0) return
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
    })*/
  }
}

export const homeStore = new HomeStore()
