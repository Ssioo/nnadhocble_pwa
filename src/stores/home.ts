/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * nnadhocble_pwa from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 22. 오후 1:04
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import { makeAutoObservable } from 'mobx'

class HomeStore {
  bleAvailable = false
  localVideoTrack: MediaStreamTrack[] | null = null
  localAudioTrack: MediaStreamTrack[] | null = null

  constructor() {
    makeAutoObservable(this)
  }
}

export const homeStore = new HomeStore()
