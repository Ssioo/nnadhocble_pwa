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
    if (!('requestLEScan' in navigator.bluetooth)) return null
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
      {bleAvailable ?
        <div>
          <DeviceList/>
          <button onClick={async () => {
            if (!scan?.active) await scanBles()
            else scan?.stop
          }}>
            {scan?.active ? 'Stop' : 'Scan'}
          </button>
        </div>
        : <div>현재 디바이스는 Bluetooth를 지원하지 않습니다</div>
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
