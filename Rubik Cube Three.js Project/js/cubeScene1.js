// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const cube = [
  // Front face (green)
  [
      ['Cube018_Material005_0', 'Cube019_Material005_0', 'Cube020_Material005_0'],
      ['Cube009_Material005_0', 'Cube010_Material005_0', 'Cube011_Material005_0'],
      ['Cube_Material005_0', 'Cube001_Material005_0', 'Cube002_Material005_0']
  ],
  // Right face (bright red)
  [
      ['Cube020_Material002_0', 'Cube023_Material002_0', 'Cube026_Material002_0'],
      ['Cube011_Material002_0', 'Cube014_Material002_0', 'Cube017_Material002_0'],
      ['Cube002_Material002_0', 'Cube005_Material002_0', 'Cube008_Material002_0']
  ],
  // Top face (pink)
  [
      ['Cube024_Material006_0', 'Cube025_Material006_0', 'Cube026_Material006_0'],
      ['Cube021_Material006_0', 'Cube022_Material006_0', 'Cube023_Material006_0'],
      ['Cube018_Material006_0', 'Cube019_Material006_0', 'Cube020_Material006_0']
  ],
  // Left face (yellow)
  [
      ['Cube024_Material004_0', 'Cube021_Material004_0', 'Cube018_Material004_0'],
      ['Cube015_Material004_0', 'Cube012_Material004_0', 'Cube009_Material004_0'],
      ['Cube_Material004_0', 'Cube003_Material004_0', 'Cube006_Material004_0']
  ],
  // Bottom face (dark red)
  [
      ['Cube_Material007_0', 'Cube001_Material007_0', 'Cube002_Material007_0'],
      ['Cube003_Material007_0', 'Cube004_Material007_0', 'Cube005_Material007_0'],
      ['Cube006_Material007_0', 'Cube007_Material007_0', 'Cube008_Material007_0']
  ],
  // Back face (blue)
  [
      ['Cube026_Material003_0', 'Cube025_Material003_0', 'Cube024_Material003_0'],
      ['Cube017_Material003_0', 'Cube016_Material003_0', 'Cube015_Material003_0'],
      ['Cube008_Material003_0', 'Cube007_Material003_0', 'Cube006_Material003_0']
  ],
  // ... and so on for other faces
];

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

// Set camera position and orientation
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Load 3x3 Rubik's Cube model
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
loadModelAndAddToScene("models/rubiks_cube.glb", new THREE.Vector3(0, 0, 0), 0.1);

// Render loop to update and render scene
function animate() {
    renderer.render(scene, camera);
    controls.update(); // Update controls
    requestAnimationFrame(animate);
}

// Start animation loop
animate();