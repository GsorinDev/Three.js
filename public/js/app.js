import '../css/style.css'
import * as THREE from 'three'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

const raycaster = new THREE.Raycaster()
const points = [{
    // 'Test' button
    position: new THREE.Vector3(-7, 8.7, -2.8),
    element: document.querySelector('.point-1')
    }
]

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( '#ffffff')


// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 25
pointLight.position.y = 25
pointLight.position.z = 25
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, 1)
pointLight2.position.x = -100
pointLight2.position.y = 25
pointLight2.position.z = -100
scene.add(pointLight2)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let sceneReady = false
const loader = new GLTFLoader()
loader.load('assets/low_poly_room.glb', function (glb){
    const root = glb.scene
    root.scale.set(0.05,0.05,0.05)
    scene.add(root)
}, function (xhr){
    console.log((xhr.loaded/xhr.total*100),"% loaded")
    if ((xhr.loaded/xhr.total*100) === 100) {
        sceneReady = true
    }
},function(error){
    console.error(error)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 15
camera.position.y = 7.5
camera.position.z = 0
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.update();
controls.enableDamping = true
// controls.screenSpacePanning = false
controls.zoomSpeed = 0.8
// controls.minDistance = 0.2
controls.maxDistance = 20
controls.maxPolarAngle = 0.5 * Math.PI
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.gammaOuput = true


/**
 * Animate
 */
const clock = new THREE.Clock()

const modal = document.querySelector(".modal")

modal.addEventListener("click", e => {
    modal.style.display = "none"
})

const cameraPosition = camera.position

const tick = () =>
{
    // Update Orbital Controls
    controls.update()

    if (sceneReady) {
        // Go through each point
        for (const point of points) {
            point.element.addEventListener('click', function() {
                point.element.classList.add('clicked');
                setTimeout( () => {
                    point.element.classList.remove('clicked');
                    point.element.style.display = "none"
                    }, 2300)

                controls.enableRotate = false
                controls.enableZoom = false

                gsap.to(camera.position, { duration: 2.5, ease: "power1.inOut",
                    x: -5,
                    y: 8.7,
                    z: -2.8})

                gsap.to(controls.target, { duration: 2.5, ease: "power1.inOut",
                    x: -7,
                    y: 8.7,
                    z: -2.8})
                });

                // setTimeout( () => {
                //     modal.style.display = "flex"
                // }, 3800)



            const screenPosition = point.position.clone()
            screenPosition.project(camera)
    
            raycaster.setFromCamera(screenPosition, camera)
            const intersects = raycaster.intersectObjects(scene.children, true)
    
            if (intersects.length === 0) {
                point.element.classList.add('visible')
            } else {
                const intersectionDistance = intersects[0].distance
                const pointDistance = point.position.distanceTo(camera.position)
    
                if (intersectionDistance < pointDistance) {
                    point.element.classList.remove('visible')
                } else {
                    point.element.classList.add('visible')
                }
            }
            const translateX = screenPosition.x * sizes.width * 0.5
            const translateY = -screenPosition.y * sizes.height * 0.5


            point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
        }
    }
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


tick()