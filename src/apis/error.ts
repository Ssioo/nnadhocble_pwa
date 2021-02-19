/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * nnadhocble_pwa from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 1. 오후 6:21
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

export class ApiError extends Error {
  constructor(res) {
    super(`${res.success}`)
  }
}
