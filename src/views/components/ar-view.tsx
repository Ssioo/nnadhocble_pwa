import React, { RefObject, useEffect, useRef } from 'react'
import { AmbientLight, Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const ARView: React.FC<{
  light?: number,
  modelUrl: string,
}> = ({ modelUrl }) => {
  const renderer = useRef<WebGLRenderer>(new WebGLRenderer({ antialias: true }))

  useEffect(() => {
    const scene = new Scene()
    const camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10)
    scene.add(camera)
    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {
        scene.add(gltf.scene)
        renderer.current.setClearAlpha(0.0)
        renderer.current.setAnimationLoop(() => {
          renderer.current.render(scene, camera)
        })
        const element = document.getElementById('render_space')
        const newCanv = renderer.current.domElement
        newCanv.width = window.innerWidth
        newCanv.height = window.innerHeight
        newCanv.style.top = '0'
        newCanv.style.position = 'fixed'
        element?.parentNode?.replaceChild(newCanv, element)
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
