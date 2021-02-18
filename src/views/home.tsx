import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { deviceStore } from '../stores/device'
import { observer } from 'mobx-react-lite'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as CocoSsd from '@tensorflow-models/coco-ssd'

const HomeScreen = () => {
  const [bleAvailable, setBleAvailable] = useState(false)
  const [scan, setScan] = useState<BluetoothLEScan | null>(null)
  const [predicted, setPredicted] = useState<CocoSsd.DetectedObject[]>([])

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
        video.onloadeddata = () => {
          video?.play()
        }
      })
    }
    return () => {
      scan?.stop()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!model) return
      const video = camera.current
      if (!video) return
      model.current?.detect(video).then((prediction) => {
        setPredicted(prediction)
      })
    }, 100)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const canv = canvas.current
    const ctx = canv?.getContext('2d')
    if (!canv || !ctx) return
    ctx.clearRect(0, 0, canv.width, canv.height)
    if (predicted.length !== 4) return
    predicted.forEach((p) => {
      ctx.strokeStyle = '#FF0000'
      ctx.strokeRect(p.bbox[0], p.bbox[1], p.bbox[2], p.bbox[3])
    })
  }, [predicted])

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
      <div>
        {predicted.map((p) => p.class).join(', ')}
      </div>
      <div style={{ width: '100%', height: '80%' }}>
        <video
          style={{ width: '100%', height: '100%' }}
          ref={camera}
          autoPlay
        />
      </div>
      <div style={{ width: '100%', height: '80%', position: 'absolute'}}>
        <canvas ref={canvas} style={{ width: '100%', height: '100%' }} />
      </div>
      {/*<button
        onClick={async () => {
          if (!scan?.active) await scanBles()
          else scan?.stop
        }}
      >
        {scan?.active ? 'Stop' : 'Scan'}
      </button>*/}
    </div>
  )
}

const DeviceList = observer(() => {
  return (
    <div>
      {deviceStore.devices.length === 0 ?
        <div>검색된 디바이스가 없습니다</div> :
        <div>
          {deviceStore.devices.map((d) => {
              const de = deviceStore.deviceDataMap.get(d)
              return <DeviceItem device={d} rssi={de?.rssi} power={de?.txPower} key={d.id.toString()}/>
            }
          )}
        </div>
      }
    </div>
  )
})

const DeviceItem: React.FC<{ device: BluetoothDevice, rssi: number, power: number }> = ({ device, rssi, power }) => {
  return (
    <div>
      {device.name ?? '이름없음'} ::: rx: {rssi}, power: {power}
    </div>
  )
}

export default HomeScreen
