/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 15. 오전 10:25
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import { makeAutoObservable } from 'mobx'

class DeviceStore {

  devices: BluetoothDevice[] = []
  deviceDataMap: Map<BluetoothDevice, { rssi: any, txPower: any }> = new Map<BluetoothDevice, { rssi: any; txPower: any }>()

  constructor() {
    makeAutoObservable(this)
  }
}

export const deviceStore = new DeviceStore()
