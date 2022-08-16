import "./style.css";
import sunTexture from "./assets/textures/sun.jpg";
import mercuryTexture from "./assets/textures/mercury.jpg";
import venusTexture from "./assets/textures/venus.jpg";
import earthTexture from "./assets/textures/earth_day.jpg";
import moonTexture from "./assets/textures/moon.jpg";
import marsTexture from "./assets/textures/mars.jpg";
import jupiterTexture from "./assets/textures/jupiter.jpg";
import saturnTexture from "./assets/textures/saturn.jpg";
import saturnRingTexture from "./assets/textures/saturn_ring.png";
import uranusTexture from "./assets/textures/uranus.jpg";
import neptuneTexture from "./assets/textures/neptune.jpg";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DoubleSide } from "three";

// Add webgl Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add renderer to the body
document.body.appendChild(renderer.domElement);

// Resize the rendering and camera as per window's width and height
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
});


// Add Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0.1, 25) // x, y, and z positions

// Sun
const sunGeo = new THREE.SphereGeometry( 3, 150, 150 );
const sunText = new THREE.TextureLoader().load(sunTexture) // Load Texture image
const sunMaterial = new THREE.MeshBasicMaterial( {map: sunText} );
const sun = new THREE.Mesh( sunGeo, sunMaterial );
sun.position.x = 2
scene.add( sun );

// Function for creating planets
function createPlanet(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry( size, 100, 100 );
    const planetTexture = new THREE.TextureLoader().load(texture) // Load Texture image
    const material = new THREE.MeshStandardMaterial( {map: planetTexture} );
    const planetMesh = new THREE.Mesh( geo, material );
    planetMesh.position.x = position
    const planetObj = new THREE.Object3D()
    planetObj.add( planetMesh );
    if(ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(ring.texture),
            side: DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        planetObj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x =   0.5 * Math.PI

    }
    scene.add(planetObj)
    return { planetMesh, planetObj }
}

const mercury = createPlanet(0.5, mercuryTexture, 10);
const venus = createPlanet(0.8, venusTexture, 15);
const earth = createPlanet(1, earthTexture, 23);
const mars = createPlanet(1.1, marsTexture, 30);
const jupiter = createPlanet(2, jupiterTexture, 43);
const saturn = createPlanet(1.5, saturnTexture, 53, {
    innerRadius: 2,
    outerRadius: 4,
    texture: saturnRingTexture
});
const uranus = createPlanet(1.2, uranusTexture, 66);
const neptune = createPlanet(1.1, neptuneTexture, 75);

// saturn.planetObj.add(saturnRing)


const pointLight = new THREE.PointLight( 0xffffff, 3, 300)
scene.add( pointLight );

// Add orbit controls to camera
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


const vertices = [];

for ( let i = 0; i < 10000; i ++ ) {
	const x = THREE.MathUtils.randFloatSpread( 2000 );
	const y = THREE.MathUtils.randFloatSpread( 2000 );
	const z = THREE.MathUtils.randFloatSpread( 2000 );
	vertices.push( x, y, z );
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

const material2 = new THREE.PointsMaterial( { color: 0x00ddff } );
const points = new THREE.Points( geometry, material2 );

scene.add( points );
// Recursive function to keep re-rendering
function animate() {
    requestAnimationFrame(animate);

    // Rotaions
    mercury.planetMesh.rotateY(0.008);
    mercury.planetObj.rotateY(0.005);
    venus.planetMesh.rotateY(0.0001);
    venus.planetObj.rotateY(0.003);
    earth.planetMesh.rotateY(0.05);
    earth.planetObj.rotateY(0.001);

    mars.planetMesh.rotateY(0.03)
    mars.planetObj.rotateY(0.003);

    jupiter.planetMesh.rotateY(0.1)
    jupiter.planetObj.rotateY(0.0002);

    sun.rotation.y += 0.001
    controls.update();
    renderer.render(scene, camera);
}
animate()