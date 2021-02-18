import { Color, WebGLRenderer } from 'three'

export const initializeRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({ alpha: true, canvas })
  renderer.setClearColor(new Color(('lightgrey')), 0)
  renderer.setSize(canvas.width, canvas.height)
  return renderer
}
