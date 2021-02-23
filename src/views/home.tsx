
/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 22. 오후 2:03
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { deviceStore } from '../stores/device'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as CocoSsd from '@tensorflow-models/coco-ssd'
import { homeStore } from '../stores/home'
import { ARView } from './components/ar-view'

const detectFromVideoFrame = (
  model,
  video: HTMLVideoElement,
  setPredicted: (predictions: CocoSsd.DetectedObject[]) => void
) => {
  model.detect(video).then((predictions) => {
    setPredicted(predictions)
    requestAnimationFrame(() => {
      detectFromVideoFrame(model, video, setPredicted)
    })
  })
}

const HomeScreen = () => {
  const [scan, setScan] = useState<BluetoothLEScan | null>(null)
  const [predicted, setPredicted] = useState<CocoSsd.DetectedObject[]>([])
  const [videoSize, setVideoSize] = useState<{ width: number, height: number }>()

  const cameraView = useRef<HTMLVideoElement | null>(null)
  const canvasView = useRef<HTMLCanvasElement | null>(null)
  const model = useRef<CocoSsd.ObjectDetection | null>(null)

  useEffect(() => {
    if (navigator.bluetooth && 'getAvailability' in navigator.bluetooth) {
      navigator.bluetooth.getAvailability()
        .then((a) => {
          console.log('BLE is in: ', a)
          homeStore.bleAvailable = a
        })
    }
    if (navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
      // 1. Load MediaDevice
      const mediaPromise = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: {
            exact: window.innerHeight // 왜 뒤집어져야 제대로 맞는지 모르겠음. orientation에 대한 항목?
          },
          height: {
            exact: window.innerWidth
          },
          facingMode: {
            exact: 'environment'
          },
        }
      }).then((stream) => {
        const video = cameraView.current
        if (!video) return
        video.srcObject = stream
        homeStore.localVideoTrack = stream.getVideoTracks()
        video.onplay = () => {
          setVideoSize({
            width: video.videoWidth,
            height: video.videoHeight,
          })
        }
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            resolve(true)
          }
        })
      })

      // 2. Load CocoSSd Model
      const modelPromise = CocoSsd.load({ base: 'lite_mobilenet_v2' })

      // Wait for both 1 & 2
      Promise.all([modelPromise, mediaPromise])
        .then((values) => {
          model.current = values[0]
          detectFromVideoFrame(values[0], cameraView.current!!, setPredicted)
        })
    }

    return () => {
      scan?.stop()
      model.current?.dispose()
    }
  }, [])

  useEffect(() => {
    const canv = canvasView.current
    const ctx = canv?.getContext('2d')
    const gl = canv?.getContext('webgl2')
    if (!canv || !ctx) return
    ctx.clearRect(0, 0, canv.width, canv.height)
    if (predicted.length === 0) return
    ctx.font = '24px helvetica'
    predicted.forEach((p) => {
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
  }, [predicted, videoSize])

  const scanBles = async (): Promise<BluetoothLEScan | null> => {
    if (!homeStore.bleAvailable) return null
    if (!navigator.bluetooth || !('requestLEScan' in navigator.bluetooth)) return null // TODO: Samsung Internet & Windows에서 Chrome 지원 필요.
    const scan = await navigator.bluetooth.requestLEScan({ acceptAllAdvertisements: true })
    navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
      const newDevices = new Set([...deviceStore.devices, event.device])
      deviceStore.devices = [...newDevices]
      deviceStore.deviceDataMap.set(event.device, { rssi: event.rssi, txPower: event.txPower })
    })
    setScan(scan)
    return scan
  }

  return (
    <div style={{ width: window.innerWidth, height: window.innerHeight }}>
      <video
        style={{ width: window.innerWidth, height: window.innerHeight, position: 'fixed', top: 0, left: 0, display: 'none' }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={cameraView}
        autoPlay
        muted
        playsInline
        controls={false}
      />
      <ARView
        light={50}
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0
        }}
        video={cameraView}
        modelUrl='interpolationTest.glb'
      />
      <canvas
        ref={canvasView}
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0
        }}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  )
}
export default HomeScreen
