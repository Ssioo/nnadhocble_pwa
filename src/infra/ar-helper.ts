/*
 * Copyright: Copyright (c) 2021. wooisso <yeonwoo.cho@yonsei.ac.kr>
 * License: MIT
 * nnadhocble_pwa from Mobed Laboratory, Yonsei University
 * Last Updated At 21. 2. 18. 오후 12:51
 *
 * @link http://github.com/Ssioo/nnadhoc_ble for the original source repository
 */

import { Color, WebGLRenderer } from 'three'

export const initializeRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({ alpha: true, canvas })
  renderer.setClearColor(new Color(('lightgrey')), 0)
  renderer.setSize(canvas.width, canvas.height)
  return renderer
}
