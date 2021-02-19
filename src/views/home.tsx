import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { deviceStore } from '../stores/device'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as CocoSsd from '@tensorflow-models/coco-ssd'

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
  const [bleAvailable, setBleAvailable] = useState(false)
  const [scan, setScan] = useState<BluetoothLEScan | null>(null)
  const [predicted, setPredicted] = useState<CocoSsd.DetectedObject[]>([])
  const [videoSize, setVideoSize] = useState<{ width: number, height: number }>()

  const camera = useRef<HTMLVideoElement | null>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const model = useRef<CocoSsd.ObjectDetection | null>(null)

  useEffect(() => {
    if (navigator.bluetooth && 'getAvailability' in navigator.bluetooth) {
      navigator.bluetooth.getAvailability().then((a) => {
        console.log('BLE is in: ', a)
        setBleAvailable(a)
      })
    }
    if (navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
      // 1. Load MediaDevice
      const mediaPromise = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: {
            exact: window.innerWidth
          },
          height: {
            exact: window.innerHeight
          },
          facingMode: {
            exact: 'environment'
          },
        }
      }).then((stream) => {
        const video = camera.current
        if (!video) return
        video.srcObject = stream
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
          detectFromVideoFrame(values[0], camera.current!!, setPredicted)
        })
    }

    return () => {
      scan?.stop()
      model.current?.dispose()
    }
  }, [])

  useEffect(() => {
    const canv = canvas.current
    const ctx = canv?.getContext('2d')
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
    if (!bleAvailable) return null
    console.log('scanning...1')
    if (!navigator.bluetooth || !('requestLEScan' in navigator.bluetooth)) return null // TODO: Samsung Internet & Windows에서 Chrome 지원 필요.
    const scan = await navigator.bluetooth.requestLEScan({ acceptAllAdvertisements: true })
    console.log('scanning...2')
    navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
      const newDevices = new Set([...deviceStore.devices, event.device])
      deviceStore.devices = [...newDevices]
      deviceStore.deviceDataMap.set(event.device, { rssi: event.rssi, txPower: event.txPower })
    })
    console.log('scanning...3')
    setScan(scan)
    return scan
  }

  return (
    <div>
      <div style={{ width: window.innerWidth, height: window.innerHeight }}>
        <video
          style={{ width: window.innerWidth, height: window.innerHeight, position: 'fixed', top: 0, left: 0 }}
          width={window.innerWidth}
          height={window.innerHeight}
          ref={camera}
          autoPlay
          muted
          playsInline
          controls={false}
        />
        <canvas
          ref={canvas}
          style={{ width: window.innerWidth, height: window.innerHeight, display: 'block', position: 'fixed', top: 0, left: 0 }}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>
    </div>
  )
}
export default HomeScreen
