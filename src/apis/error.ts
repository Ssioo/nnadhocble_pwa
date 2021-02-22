/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * webcross_ar_app from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 19. 오후 4:50
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

export class ApiError extends Error {
  constructor(res) {
    super(`${res.success}`)
  }
}
