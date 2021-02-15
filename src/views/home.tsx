import { useEffect, useState } from 'react'
import React from 'react'
import { deviceStore } from '../stores/device'
import { observer } from 'mobx-react-lite'

const HomeScreen = () => {
  const [bleAvailable, setBleAvailable] = useState(false)
  const [scan, setScan] = useState<BluetoothLEScan | null>(null)
  useEffect(() => {
    navigator.bluetooth.getAvailability().then((a) => {
      console.log('BLE is in: ', a)
      setBleAvailable(a)
    })
    return () => {
      scan?.stop()
    }
  }, [])

  const scanBles = async (): Promise<BluetoothLEScan | null> => {
    if (!bleAvailable) return null
    console.log('scanning...1')
    const scan = await navigator.bluetooth.requestLEScan({ acceptAllAdvertisements: true })
    console.log('scanning...2')
    navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
      console.log(event.device.name, ' = ', event.rssi, ' power: ', event.txPower)
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
      {bleAvailable ?
        <div>
          <DeviceList/>
          <button onClick={async () => {
            await scanBles()
          }}>
            Scan
          </button>
        </div> :
        <div>현재 디바이스는 Bluetooth를 지원하지 않습니다</div>
      }
    </div>
  )
}

const DeviceList = observer(() => {
  return (
    <div>
      {deviceStore.devices.length === 0 ?
        <div>검색된 디바이스가 없습니다</div> :
        <div>
          {deviceStore.devices.map((d) =>
            <DeviceItem device={d} key={d.id.toString()}/>
          )}
        </div>
      }
    </div>
  )
})

const DeviceItem: React.FC<{ device: BluetoothDevice }> = ({ device }) => {
  return (
    <div>
      {device.name} {device.id}
    </div>
  )
}

export default HomeScreen
