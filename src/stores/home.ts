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

  @action
  async detectFromVideoFrame() {
    if (!this.cameraView.current || !this.model) return
    try {
      this.predicted = await this.model?.detect(this.cameraView.current!!)
      if (this.scene && this.camera) {
        this.renderer?.render(this.scene, this.camera)
        console.log('Frame Updated')
      }
      requestAnimationFrame(() => {
        this.detectFromVideoFrame()
      })
    } catch (e) {
      console.log(e)
    }
  }

  drawDetectedObjects(predictions: CocoSsd.DetectedObject[]) {
    const canv = this.canvasView.current
    const gl = canv?.getContext('webgl2')
    if (!canv || !gl) return
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    this.drawSquare(gl)

    /*if (predictions.length === 0) return
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
    })*/
  }

  drawSquare(gl: WebGL2RenderingContext) {
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [
      -0.2, -0.2, 0,
      0.2, -0.2, 0,
      0.2, 0.2, 0,
      -0.2, 0.2, 0
    ]
    const indices = [0, 1, 2, 0, 2, 3]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
  }
}

export const homeStore = new HomeStore()
