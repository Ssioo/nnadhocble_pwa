import React, { useEffect } from 'react'
import { AmbientLight, Camera, Scene } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const ARView: React.FC<{ light: number, modelUrl: string }> = ({ light, modelUrl }) => {

  useEffect(() => {
    const scene = new Scene()
    const camera = new Camera()
    const ambLight = new AmbientLight(0x404040, light)
    scene.add(camera, ambLight)
    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {

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
    <div>

    </div>
  )
}
