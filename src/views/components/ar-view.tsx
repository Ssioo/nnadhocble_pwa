import React, { useEffect } from 'react'
import { LinearFilter, Mesh, MeshBasicMaterial, PerspectiveCamera, RGBFormat, VideoTexture, WebGLRenderer } from 'three'
import { homeStore } from '../../stores/home'
import { observer } from 'mobx-react-lite'

export const AROverlay: React.FC<{
  light?: number,
  modelUrl: string,
  style?: any,
}> = observer(({ modelUrl, light, style }) => {

  useEffect(() => {
    homeStore.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20)
    homeStore.camera.position.z = 1

    homeStore.texture = new VideoTexture(homeStore.cameraView.current!!)
    homeStore.texture.minFilter = LinearFilter
    homeStore.texture.magFilter = LinearFilter
    homeStore.texture.format = RGBFormat

    homeStore.material = new MeshBasicMaterial({ map: homeStore.texture })
    const mesh = new Mesh(homeStore.geometry, homeStore.material)
    homeStore.scene.add(mesh)

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
  }, [])

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
