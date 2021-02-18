import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { deviceStore } from '../stores/device'
import { observer } from 'mobx-react-lite'
import Webcam from 'react-webcam'
import CocoSsd, { ObjectDetection } from '@tensorflow-models/coco-ssd'

const HomeScreen = () => {
  const [bleAvailable, setBleAvailable] = useState(false)
  const [scan, setScan] = useState<BluetoothLEScan | null>(null)
  const camera = useRef<Webcam | null>(null)

  const model = useRef<ObjectDetection | null>(null)

  useEffect(() => {
    if (navigator.bluetooth && 'getAvailability' in navigator.bluetooth) {
      navigator.bluetooth.getAvailability().then((a) => {
        console.log('BLE is in: ', a)
        setBleAvailable(a)
      })
    }
    return () => {
      scan?.stop()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!model) return
      const canvas = camera.current?.getCanvas({ width: 600, height: 400 })
      if (!canvas) return
      const prediction = model.current?.detect(canvas)
      console.log(prediction)
    }, 33)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    CocoSsd.load()
      .then((m) => model.current = m)
  })

  const scanBles = async (): Promise<BluetoothLEScan | null> => {
    if (!bleAvailable) return null
    console.log('scanning...1')
    if (!('requestLEScan' in navigator.bluetooth)) return null // TODO: Samsung Internet & Windows에서 Chrome 지원 필요.
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
      <div style={{ width: 400, height: 600 }}>
        <Webcam
          ref={camera}
          screenshotFormat='image/jpeg'
          height={600}
          width={400}
          audio
          videoConstraints={{
            width: 1080,
            height: 1920,
            facingMode: { exact: 'environment' },
            resizeMode: 'cover',
          }}
        />
      </div>
      <button
        onClick={async () => {
          if (!scan?.active) await scanBles()
          else scan?.stop
        }}
      >
        {scan?.active ? 'Stop' : 'Scan'}
      </button>
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
