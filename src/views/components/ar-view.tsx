import React, { useEffect, useRef } from 'react'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'

export const ARView: React.FC<{
  light?: number,
  modelUrl: string,
  style?: any,
}> = ({ modelUrl, light, style }) => {

  useEffect(() => {
    const scene = new Scene()
    const camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20)
    scene.add(camera)

    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearAlpha(0.0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    const element = document.getElementById('render_space')
    const newCanv = renderer.domElement
    newCanv.style.top = '0'
    newCanv.style.left = '0'
    newCanv.style.position = 'fixed'
    element?.parentNode?.replaceChild(newCanv, element)
    element?.parentNode?.appendChild(ARButton.createButton(renderer))

    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {
        scene.add(gltf.scene)
        renderer.setAnimationLoop((time) => {
          renderer.render(scene, camera)
        })
      },
      (xhr) => {
      },
      (e) => {
        console.log(e)
      }
    )

    return () => {
    }
  }, [])

  return (
    <>
      <div id='render_space' />
    </>
  )
}
