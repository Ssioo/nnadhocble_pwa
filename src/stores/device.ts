import { makeAutoObservable, reaction } from 'mobx'

class DeviceStore {

  devices: BluetoothDevice[] = []
  deviceDataMap: Map<BluetoothDevice, { rssi: any, txPower: any }> = new Map<BluetoothDevice, { rssi: any; txPower: any }>()

  constructor() {
    makeAutoObservable(this)
    reaction(() => this.devices, (ds) => {
      ds.forEach((d) => {
        d.watchAdvertisements()
        d.addEventListener('advertisementreceived', (event) => {
          this.deviceDataMap.set(d, { rssi: event['rssi'], txPower: event['txPower']})
        })
      })
    })
  }
}

export const deviceStore = new DeviceStore()
