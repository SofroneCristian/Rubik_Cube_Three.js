// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Load the skybox GLB model
function loadSkybox(modelPath) {
    const loader = new THREE.GLTFLoader();
    loader.load(
        modelPath,
        (gltf) => {
            const skybox = gltf.scene;
            skybox.scale.set(1000, 1000, 1000); // Scale the skybox large enough to enclose the scene
            scene.add(skybox);
        },
        undefined,
        (error) => {
            console.error("Error loading skybox model:", error);
        }
    );
}

// Load the skybox model
loadSkybox("textures/Galaxy_texture.glb");

// Load model and add to scene
function loadModelAndAddToScene(modelPath, position, scale) {
    const loader = new THREE.GLTFLoader();
    loader.load(
        modelPath,
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(scale, scale, scale);
            model.position.copy(position);
            scene.add(model);
        },
        undefined,
        (error) => {
            console.error("Error loading model:", error);
        }
    );
}

// Load 3x3 Rubik's Cube model
loadModelAndAddToScene("models/pyraminx.glb", new THREE.Vector3(0, 0, 0), 0.1);

// Set camera position and orientation
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Render loop to update and render scene
function animate() {
    renderer.render(scene, camera);
    controls.update(); // Update controls
    requestAnimationFrame(animate);
}

// Start animation loop
animate();
