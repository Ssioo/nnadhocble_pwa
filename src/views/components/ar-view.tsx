import React, { RefObject, useEffect } from 'react'
import {
  HemisphereLight,
  LinearFilter, Mesh, MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  RGBFormat,
  Scene,
  VideoTexture,
  WebGLRenderer
} from 'three'

const updateUI = (renderer, scene, camera) => {
  requestAnimationFrame(() => {
    updateUI(renderer, scene, camera)
  })
  renderer.render(scene, camera)
}

export const ARView: React.FC<{
  light?: number,
  modelUrl: string,
  style?: any,
  video: RefObject<HTMLVideoElement>
}> = ({ modelUrl, light, style, video }) => {
  useEffect(() => {
    const scene = new Scene()
    const camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20)
    camera.position.z = 1

    const texture = new VideoTexture(video.current!!)
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.format = RGBFormat

    const geometry = new PlaneBufferGeometry()
    const material = new MeshBasicMaterial({ map: texture })
    const mesh = new Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)

    const element = document.getElementById('render_space')
    const newCanv = renderer.domElement
    newCanv.style.top = '0'
    newCanv.style.left = '0'
    newCanv.style.position = 'fixed'
    element?.parentNode?.appendChild(newCanv)

    /*const loader = new GLTFLoader()
    loader.loadAsync(modelUrl)
      .then((m) => scene.add(m.scene))*/

    updateUI(renderer, scene, camera)
  }, [])

  return (
    <>
      <div id='render_space' />
    </>
  )
}
