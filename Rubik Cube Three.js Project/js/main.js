// Set up the scene, camera, and renderer
console.log("Setting up scene, camera, and renderer...");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
console.log("Adding OrbitControls...");
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Load the skybox GLB model
console.log("Loading skybox model...");
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

loadSkybox("textures/Galaxy_texture.glb");

// Function to load GLB model using GLTFLoader
console.log("Defining loadModel function...");
function loadModel(modelPath) {
    const loader = new THREE.GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(
            modelPath,
            (gltf) => {
                resolve(gltf.scene);
            },
            undefined,
            reject
        );
    });
}

// Function to add hover effect after all text meshes are loaded
console.log("Defining addHoverEffectAfterTextMeshesLoaded function...");
async function addHoverEffectAfterTextMeshesLoaded() {
    let rubiksCubeModel, pyraminxModel, twoByTwoRubiksCubeModel;

    // Load Rubik's Cube model
    console.log("Loading Rubik's Cube model...");
    rubiksCubeModel = await loadModel("models/rubiks_cube.glb");
    rubiksCubeModel.name = "RubiksCube"; // Assign a unique name to the model
    scene.add(rubiksCubeModel);
    rubiksCubeModel.scale.set(0.1, 0.1, 0.1);
    rubiksCubeModel.position.set(-3, 0, 0);
    const animateHover1 = addHoverEffect(rubiksCubeModel, textMeshes[1], rubiksCubeModel, pyraminxModel, twoByTwoRubiksCubeModel);
    animateFunctions.push(() => animateHover1());

    // Load Pyraminx model
    console.log("Loading Pyraminx model...");
    pyraminxModel = await loadModel("models/pyraminx.glb");
    pyraminxModel.name = "Pyraminx"; // Assign a unique name to the model
    scene.add(pyraminxModel);
    pyraminxModel.scale.set(0.15, 0.15, 0.15);
    pyraminxModel.position.set(0, 0.08, 0);
    const animateHover2 = addHoverEffect(pyraminxModel, textMeshes[2], rubiksCubeModel, pyraminxModel, twoByTwoRubiksCubeModel);
    animateFunctions.push(() => animateHover2());

    // Load 2x2 Rubik's Cube model
    console.log("Loading 2x2 Rubik's Cube model...");
    twoByTwoRubiksCubeModel = await loadModel("models/2x2_rubiks_cube.glb");
    twoByTwoRubiksCubeModel.name = "TwoByTwoRubiksCube"; // Assign a unique name to the model
    scene.add(twoByTwoRubiksCubeModel);
    twoByTwoRubiksCubeModel.scale.set(2, 2, 1);
    twoByTwoRubiksCubeModel.position.set(3, -0.1, 0);
    const animateHover3 = addHoverEffect(twoByTwoRubiksCubeModel, textMeshes[3], rubiksCubeModel, pyraminxModel, twoByTwoRubiksCubeModel);
    animateFunctions.push(() => animateHover3());


}
function handleModelClick(clickedObject) {
  console.log("Clicked object:", clickedObject.name);

  // Extract the type of object from its name
  const objectType = extractObjectType(clickedObject.name);

  // Based on the object type, navigate to the corresponding scene
  switch (objectType) {
      case "Cube":
          // Navigate to the scene for Rubik's Cube
          navigateToRubiksCubeScene();
          break;
      case "Piece":
          // Navigate to the scene for Pyraminx
          navigateToPyraminxScene();
          break;
      case "Object":
          // Check if it's a 2x2 Rubik's Cube tile
          if (!is2x2Tile(clickedObject.name)) {
              // Navigate to the scene for 2x2 Rubik's Cube
              navigateToTwoByTwoRubiksCubeScene();
          } else {
              // Handle it based on your requirements, such as displaying a message or doing nothing
              console.log("Clicked object doesn't require navigation to the 2x2 Rubik's Cube scene.");
          }
          break;
      default:
          // Handle clicks on other objects or unknown objects
          console.log("Clicked object does not have a corresponding scene.");
          break;
  }
}

function extractObjectType(objectName) {
  // Extract the type of object based on naming conventions
  if (objectName.startsWith("Cube")) {
      return "Cube";
  } else if (objectName.startsWith("Piece")) {
      return "Piece";
  } else {
      return "Object"; // Return "Object" for any other cases
  }
}

function is2x2Tile(objectName) {
  // Check if the object name indicates a 2x2 Rubik's Cube tile
  const result = !(objectName.startsWith("Object_") && !objectName.endsWith("_4"));
  console.log("Object name:", objectName, "Comparison result:", result);
  return result;
}




function navigateToRubiksCubeScene() {
  // Redirect to the scene for Rubik's Cube
  window.location.href = 'cubeScene1.html';
}

function navigateToPyraminxScene() {
  // Redirect to the scene for Pyraminx
  window.location.href = 'cubeScene2.html';
}

function navigateToTwoByTwoRubiksCubeScene() {
  // Redirect to the scene for 2x2 Rubik's Cube
  window.location.href = 'cubeScene3.html';
}


// Add this code after removing the click event listeners for individual models
renderer.domElement.addEventListener('click', onDocumentClick, false);

// Function to handle click events
function onDocumentClick(event) {
  event.preventDefault();
  
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2(
      (event.clientX - rect.left) / rect.width * 2 - 1,
      - (event.clientY - rect.top) / rect.height * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      handleModelClick(clickedObject);
  }
}




// Load text meshes
console.log("Loading text meshes...");
async function loadTextMeshes() {
    const fontLoader = new THREE.FontLoader();
    const font = await new Promise((resolve, reject) => {
        fontLoader.load(
            "https://cdn.rawgit.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json",
            resolve,
            undefined,
            reject
        );
    });

    const textOptions = { font: font, size: 0.1, height: 0.02, curveSegments: 12 };

    function createTextMesh(text, position) {
        const textGeometry = new THREE.TextGeometry(text, textOptions);
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.copy(position);
        scene.add(textMesh);
        textMeshes.push(textMesh);
        return textMesh;
    }

    createTextMesh("Choose gamemode", new THREE.Vector3(-0.5, 1.5, 0));
    createTextMesh("3x3 Cube", new THREE.Vector3(-3, -0.5, 0));
    createTextMesh("Pyraminx", new THREE.Vector3(-0.24, -0.5, 0));
    createTextMesh("2x2 Cube", new THREE.Vector3(2.87, -0.5, 0));

    // Update function to make text face the camera
    function updateTextRotation() {
      console.log("Updating text rotation...");
      textMeshes.forEach((mesh) => {
          mesh.lookAt(camera.position);
      });
  }

  // Render loop to update and render scene
  function animate() {
      updateTextRotation(); // Make text face the camera
      controls.update(); // Update controls
      animateFunctions.forEach(fn => fn()); // Call hover animations
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
  }

  animate();
}

// Hover effect handler
function addHoverEffect(model, label, rubiksCubeModel, pyraminxModel, twoByTwoRubiksCubeModel) {
  const initialScale = model.scale.clone();
  const hoverScale = initialScale.clone().multiplyScalar(1.1);
  let isHovered = false;

  function onMouseMove(event) {
      event.preventDefault();
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(model, true);

      if (intersects.length > 0) {
          if (!isHovered) {
              if (label && label.material) { // Check if label and its material exist
                  label.material.color.set(0xffff00); // Change label color to yellow
              } else {
                  console.warn("Label or its material is undefined.");
              }
              isHovered = true;
          }
      } else {
          if (isHovered) {
              if (label && label.material) { // Check if label and its material exist
                  label.material.color.set(0xffffff); // Reset label color
              } else {
                  console.warn("Label or its material is undefined.");
              }
              isHovered = false;
          }
      }
  }

  function onMouseDown(event) {
      console.log("onMouseDownTriggered")
      event.preventDefault();
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([rubiksCubeModel, pyraminxModel, twoByTwoRubiksCubeModel], true);

      if (intersects.length > 0) {
          const object = intersects[0].object;
          console.log("Clicked object:", object.name); // Log the name of the clicked object
          handleModelClick(object); // Call handleModelClick with the clicked object
      }
  }

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('mousedown', onMouseDown, false);


  function animateHover() {
      if (isHovered) {
          model.scale.lerp(hoverScale, 0.1);
      } else {
          model.scale.lerp(initialScale, 0.1);
      }
  }

  return animateHover;
}

// Global array of text meshes
const textMeshes = [];

// Global array of hover animation functions
const animateFunctions = [];

// Load text meshes and start hover effects after they are loaded
console.log("Loading text meshes and starting hover effects...");
loadTextMeshes().then(addHoverEffectAfterTextMeshesLoaded);

// Set camera position and orientation
console.log("Setting camera position and orientation...");
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Ambient light
console.log("Adding ambient light...");
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional light
console.log("Adding directional light...");
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Render loop to update and render scene
console.log("Starting render loop...");
function animate() {
  controls.update(); // Update controls
  animateFunctions.forEach(fn => fn()); // Call hover animations
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

