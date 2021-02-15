import { useEffect, useState } from 'react'
import { observable } from 'mobx'
import React from 'react'
import { deviceStore } from '../stores/device'

const HomeScreen = () => {
  const [bleAvailable, setBleAvailable] = useState(false)
  useEffect(() => {
    const scan = scanBles()
    return () => {
      scan.then((res) => {
        res?.stop()
      })
    }
  }, [])

  const scanBles = async (): Promise<BluetoothLEScan | null> => {
    const available = await navigator.bluetooth.getAvailability()
    console.log(available)
    setBleAvailable(available)
    if (!available) return null
    const scan = await navigator.bluetooth.requestLEScan({ acceptAllAdvertisements: true })
    navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
      const newDevices = new Set([...deviceStore.devices, event.device])
      deviceStore.devices = [...newDevices]
      deviceStore.deviceDataMap.set(event.device, { rssi: event.rssi, txPower: event.txPower })
    })
    return scan
  }

  return (<div>
    {bleAvailable ? <DeviceList/> : '현재 디바이스는 Bluetooth를 지원하지 않습니다'}
  </div>)
}

const DeviceList = observable(() => {
  return (<div>
    {deviceStore.devices.map((d) =>
      <DeviceItem device={d} key={d.id.toString()}/>
    )}
    <div>
      Debug: {deviceStore.deviceDataMap}
    </div>
  </div>)
})

const DeviceItem: React.FC<{ device: BluetoothDevice }> = ({ device }) => {
  return (<div>
    {device.name} {device.id}
  </div>)
}

export default HomeScreen
