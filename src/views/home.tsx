
/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 22. 오후 2:03
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { deviceStore } from '../stores/device'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as CocoSsd from '@tensorflow-models/coco-ssd'
import { homeStore } from '../stores/home'
import { AROverlay } from './components/ar-view'
import { observer } from 'mobx-react-lite'

const HomeScreen = observer(() => {
  const [scan, setScan] = useState<BluetoothLEScan | null>(null)

  useEffect(() => {
    if (navigator.bluetooth && 'getAvailability' in navigator.bluetooth) {
      navigator.bluetooth.getAvailability()
        .then((a) => {
          console.log('BLE is in: ', a)
          homeStore.bleAvailable = a
        })
    }
    if (navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
      // 1. Load MediaDevice
      const mediaPromise = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: {
            exact: window.innerHeight // 왜 뒤집어져야 제대로 맞는지 모르겠음. orientation에 대한 항목?
          },
          height: {
            exact: window.innerWidth
          },
          facingMode: {
            exact: 'environment'
          },
        }
      }).then((stream) => {
        const video = homeStore.cameraView.current
        if (!video) return
        video.srcObject = stream
        homeStore.localVideoTrack = stream.getVideoTracks()
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
          homeStore.model.current = values[0]
          homeStore.detectFromVideoFrame()
        })
    }

    return () => {
      scan?.stop()
      homeStore.model.current?.dispose()
    }
  }, [])

  const scanBles = async (): Promise<BluetoothLEScan | null> => {
    if (!homeStore.bleAvailable) return null
    if (!navigator.bluetooth || !('requestLEScan' in navigator.bluetooth)) return null // TODO: Samsung Internet & Windows에서 Chrome 지원 필요.
    const scan = await navigator.bluetooth.requestLEScan({ acceptAllAdvertisements: true })
    navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
      const newDevices = new Set([...deviceStore.devices, event.device])
      deviceStore.devices = [...newDevices]
      deviceStore.deviceDataMap.set(event.device, { rssi: event.rssi, txPower: event.txPower })
    })
    setScan(scan)
    return scan
  }

  return (
    <div style={{ width: window.innerWidth, height: window.innerHeight }}>
      <video
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          position: 'fixed',
          top: 0,
          left: 0
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={homeStore.cameraView}
        autoPlay
        muted
        playsInline
        controls={false}
      />
      <AROverlay
        light={50}
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0
        }}
        modelUrl='interpolationTest.glb'
      />
    </div>
  )
})

export default HomeScreen
