import THREE, { doubleSide, scene } from "./Three";

// Function for creating planets
export default function createPlanet(size, texture, position, ring) {
    const geo = new THREE.SphereGeometry( size, 100, 100 );
    const planetTexture = new THREE.TextureLoader().load(texture) // Load Texture image
    const material = new THREE.MeshLambertMaterial( {map: planetTexture} );
    const planetMesh = new THREE.Mesh( geo, material );
    planetMesh.position.x = position
    const planetObj = new THREE.Object3D()
    planetObj.add( planetMesh );
    if(ring) { // Only if Ring Exist
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(ring.texture),
            side: doubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        planetObj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.6 * Math.PI
    }
    scene.add(planetObj)
    return { planetMesh, planetObj }
}
