/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 22. 오후 2:03
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import React, { CSSProperties, useEffect, useState } from 'react'
import { deviceStore } from '../stores/device'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as CocoSsd from '@tensorflow-models/coco-ssd'
import { homeStore } from '../stores/home'
import { observer } from 'mobx-react-lite'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../infra/constants'
import { AROverlay } from './components/ar-overlay'

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

    // 1. Load User Media
    const mediaPromise = loadCameras()
      .then((cameras) => {
        homeStore.availableCameras = cameras
        if (cameras.length === 0) throw new Error('No Camera')
        homeStore.currentCameraIdx = cameras.findIndex((c) => c.getCapabilities().facingMode?.includes('environment'))
        return loadCameraStream(cameras[homeStore.currentCameraIdx])
      })
      .then(attachStreamToVideoView)

    // 2. Load CocoSSd Model
    const modelPromise = CocoSsd.load({ base: 'lite_mobilenet_v2' })

    // Wait for both 1 & 2
    Promise.all([modelPromise, mediaPromise])
      .then((values) => {
        homeStore.model = values[0]
        homeStore.detectFromVideoFrame()
      }).catch((e) => {
        console.log(e)
    })

    return () => {
      scan?.stop()
      homeStore.model?.dispose()
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
    <div style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}>
      <video
        style={styles.window}
        width={WINDOW_WIDTH}
        height={WINDOW_HEIGHT}
        ref={homeStore.cameraView}
        /*autoPlay*/
        muted
        playsInline
        controls={false}
      />
      <AROverlay
        style={styles.window}
        objects={homeStore.predictedDisplays}
        modelUrl='interpolationTest.glb'
      />
      <button
        style={styles.button}
        onClick={async () => {
          if (homeStore.availableCameras.length === 0) return
          const nextCameraIdx = (homeStore.currentCameraIdx + 1) % homeStore.availableCameras.length
          try {
            console.log(homeStore.availableCameras[nextCameraIdx])
            const stream = await loadCameraStream(homeStore.availableCameras[nextCameraIdx])
            homeStore.currentCameraIdx = nextCameraIdx
            await attachStreamToVideoView(stream)
          } catch (e) {
            console.log(e)
          }
        }}
      >
        Change Camera
      </button>
    </div>
  )
})

const loadCameras = async (): Promise<InputDeviceInfo[]> => {
  if (!navigator.mediaDevices
    || !('enumerateDevices' in navigator.mediaDevices)
    || !('getUserMedia' in navigator.mediaDevices)
  )
    return []
  try {
    const availableDevices = await navigator.mediaDevices.enumerateDevices()
    return availableDevices
      .filter((d) => d.kind === 'videoinput' && 'getCapabilities' in d)
      .map((d) => d as InputDeviceInfo)
  } catch (e) {
    console.log(e)
    return []
  }
}
const loadCameraStream = async (input: InputDeviceInfo): Promise<MediaStream> => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        aspectRatio: {
          ideal: WINDOW_HEIGHT / WINDOW_WIDTH
        },
        deviceId: input.deviceId,
        frameRate: {
          ideal: 30
        },
      }
    })
  } catch (e) {
    throw e
  }
}

const attachStreamToVideoView = async (stream: MediaStream): Promise<boolean> => {
  const video = homeStore.cameraView.current
  if (!video) throw new Error('Video View is not ready')
  homeStore.stopCurrentTrack()
  video.srcObject = stream
  video.load()
  homeStore.localVideoTrack = stream.getVideoTracks()
  return new Promise((resolve) => {
    video.oncanplay = () => {
      video.play()
      resolve(true)
    }
  })
}

const styles = {
  window: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    position: 'fixed',
    top: 0,
    left: 0,
  } as CSSProperties,
  button: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderRadius: 20,
    paddingTop: 6,
    paddingBottom: 6,
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    paddingLeft: 12,
    paddingRight: 12,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  } as CSSProperties
}

export default HomeScreen
