import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { deviceStore } from '../stores/device'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as CocoSsd from '@tensorflow-models/coco-ssd'

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
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: 1920,
          height: 1080,
          facingMode: { exact: 'environment' },
          resizeMode: 'cover',
        }
      }).then((stream) => {
        const video = camera.current
        if (!video) return
        video.srcObject = stream
        video.onplay = () => {
          console.log({
            width: video.videoWidth,
            height: video.videoHeight,
          })
          setVideoSize({
            width: video.videoWidth,
            height: video.videoHeight,
          })
        }
        video.onloadeddata = () => {
          video?.play()
        }
      })
    }
    const interval = setInterval(async () => {
      if (!model) return
      const video = camera.current
      if (!video) return
      try {
        const predictions = await model.current?.detect(video)
        setPredicted(predictions ?? [])
      } catch (e) {
        console.log(e)
      }
    }, 100)

    return () => {
      clearInterval(interval)
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
    ctx.font = '10px Arial'
    predicted.forEach((p) => {
      ctx.beginPath()
      const ratio = {
        width: window.innerWidth / (videoSize?.width ?? window.innerWidth),
        height: window.innerHeight / (videoSize?.height ?? window.innerHeight),
      }
      const rect: [number, number, number, number] = [p.bbox[0] * ratio.width, p.bbox[1] * ratio.height, p.bbox[2] * ratio.width, p.bbox[3] * ratio.height]
      ctx.rect(...rect)
      ctx.lineWidth = 1
      ctx.strokeStyle = '#FF0000'
      ctx.fillStyle = 'green'
      ctx.stroke()
      ctx.fillText(
        `${p.score.toFixed(3)} ${p.class}`,
        p.bbox[0],
        p.bbox[1] > 10 ? p.bbox[1] - 5 : 10
      )
    })
  }, [predicted, videoSize])

  useEffect(() => {
    CocoSsd.load({ base: 'lite_mobilenet_v2' })
      .then((m) => model.current = m)
  }, [])

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
      <div style={{ width: '100%', height: '100%' }}>
        <video
          style={{ width: '100%', height: '100%' }}
          ref={camera}
          autoPlay
        />
      </div>
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <canvas ref={canvas} style={{ width: '100%', height: '100%' }}/>
      </div>
    </div>
  )
}
export default HomeScreen
