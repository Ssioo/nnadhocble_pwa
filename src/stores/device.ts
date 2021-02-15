import { makeAutoObservable, reaction } from 'mobx'

class DeviceStore {

  devices: BluetoothDevice[] = []
  deviceDataMap: Map<BluetoothDevice, { rssi: any, txPower: any }> = new Map<BluetoothDevice, { rssi: any; txPower: any }>()

  constructor() {
    makeAutoObservable(this)
  }
}

export const deviceStore = new DeviceStore()
