import * as THREE from 'three';
import {OrbitControls} from 'jsm/controls/OrbitControls.js'
import getStartfield from './src/getStarfield.js'
import {getFresnelMat} from "./src/getFresnelMat.js"
const w = window.innerWidth
const h = window.innerHeight
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,w/h,0.1 , 1000)
camera.position.z =5
const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(w,h)
document.body.appendChild(renderer.domElement)
const earthGroup = new THREE.Group()
earthGroup.rotation.z = -23.4 * Math.PI / 180
scene.add(earthGroup)
new OrbitControls(camera , renderer.domElement)
const defaults= 16
const loader = new THREE.TextureLoader()
const geometry = new THREE.IcosahedronGeometry(1 , defaults)
const material = new THREE.MeshStandardMaterial({
  //  color:0xffff00,
  //  flatShading:true, 
  map:loader.load("./assets/images/earthbump1k.jpg")

})
const earthMesh =new THREE.Mesh(geometry,material)
earthGroup.add(earthMesh)
// scene.add(earthMesh)
const lightsMat = new THREE.MeshBasicMaterial({
  // color: 0x00ff00, 
  transparent:true,
  map:loader.load("./assets/images/earthbump1k.jpg")
  // opacity:0.6,
  // map:loader.load("./assets/images/earthbump1k.jpg"),
  // blending:THREE.AdditiveBlending
})
const lightsMesh = new THREE.Mesh(geometry , lightsMat);
earthGroup.add(lightsMesh)

const cloudsMat = new THREE.MeshStandardMaterial({
  transparent:true,
  opacity:0.8,
  map:loader.load("./textures/03_earthlights1k.jpg")
})
const cloudsMesh = new THREE.Mesh(geometry , cloudsMat)
earthGroup.add(cloudsMesh)

const fresnelMat = getFresnelMat()
const glowMesh = new THREE.Mesh(geometry , fresnelMat)
glowMesh.scale.setScalar(1.015)
earthGroup.add(glowMesh)
const stars = getStartfield({numStars:10000})
scene.add(stars)

// const hemiLight = new THREE.HemisphereLight(0xffffff , 0xffffff)
// scene.add(hemiLight)

 
const sunLight = new THREE.DirectionalLight(0xffffff)
scene.add(sunLight)
sunLight.position.set(-2,0.5,1.5)
function animate(){
  requestAnimationFrame(animate)
  // earthMesh.rotation.x +=0.001
  earthMesh.rotation.y +=0.002
  glowMesh.rotation.y +=0.0025
  cloudsMesh.rotation.y +=0.002
  lightsMesh.rotation.y += 0.002
  renderer.render(scene,camera)

}
animate()
function handleWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth , window.innerHeight)
}
window.addEventListener('resize',handleWindowResize,false)

