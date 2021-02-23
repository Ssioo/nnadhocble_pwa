import React, { RefObject, useEffect } from 'react'
import {
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneBufferGeometry,
  RGBFormat,
  Scene,
  VideoTexture,
  WebGLRenderer
} from 'three'
import { homeStore } from '../../stores/home'
import { observer } from 'mobx-react-lite'

export const AROverlay: React.FC<{
  light?: number,
  modelUrl: string,
  style?: any,
}> = observer(({ modelUrl, light, style }) => {

  useEffect(() => {
    const scene = new Scene()
    const camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20)
    camera.position.z = 1

    const texture = new VideoTexture(homeStore.cameraView.current!!)
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.format = RGBFormat

    const geometry = new PlaneBufferGeometry()
    const material = new MeshBasicMaterial({ map: texture })
    const mesh = new Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new WebGLRenderer({ antialias: true, canvas: homeStore.canvasView.current!! })
    renderer.setSize(window.innerWidth, window.innerHeight)

   /* const element = document.getElementById('overlay')
    const newCanv = renderer.domElement
    newCanv.style.top = '0'
    newCanv.style.left = '0'
    newCanv.style.position = 'fixed'*/
    //element?.prepend(newCanv)

    /*const loader = new GLTFLoader()
    loader.loadAsync(modelUrl)
      .then((m) => scene.add(m.scene))*/

    updateUI(renderer, scene, camera)
  }, [])

  const updateUI = (renderer, scene, camera) => {
    requestAnimationFrame(() => {
      updateUI(renderer, scene, camera)
    })
    renderer.render(scene, camera)
  }

  return (
    <div style={style} id='overlay'>
      <canvas
        ref={homeStore.canvasView}
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0
        }}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  )
})
