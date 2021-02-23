import React, { useEffect } from 'react'
import { LinearFilter, Mesh, MeshBasicMaterial, PerspectiveCamera, RGBFormat, VideoTexture, WebGLRenderer } from 'three'
import { homeStore } from '../../stores/home'
import { observer } from 'mobx-react-lite'
import { WINDOW_HEIGHT, WINDOW_RATIO, WINDOW_WIDTH } from '../../infra/constants'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import home from '../home'

export const AROverlay: React.FC<{
  modelUrl: string,
  style?: React.CSSProperties,
}> = observer(({ modelUrl, style }) => {

  useEffect(() => {
    homeStore.camera = new PerspectiveCamera( 70, WINDOW_RATIO, 0.01, 20)
    homeStore.camera.position.z = 1

    homeStore.texture = new VideoTexture(homeStore.cameraView.current!!)
    homeStore.texture.minFilter = LinearFilter
    homeStore.texture.magFilter = LinearFilter
    homeStore.texture.format = RGBFormat

    homeStore.material = new MeshBasicMaterial({ map: homeStore.texture })
    const mesh = new Mesh(homeStore.geometry, homeStore.material)
    homeStore.scene.add(mesh)

    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT)

    const element = document.getElementById('overlay')
    const newCanv = renderer.domElement
    newCanv.style.top = '0'
    newCanv.style.left = '0'
    newCanv.style.position = 'fixed'
    newCanv.width = WINDOW_WIDTH
    newCanv.height = WINDOW_HEIGHT
    element?.appendChild(newCanv)

    const loader = new GLTFLoader()
    loader.loadAsync(modelUrl)
      .then((m) => {
        homeStore.scene.add(m.scene)
      })
  }, [])

  return (
    <div style={style} id='overlay'/>
  )
})
