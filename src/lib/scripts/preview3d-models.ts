// // import * as THREE from "three";
// // import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


// // export interface Preview3DOptions {
// //   url: string;
// //   scene: THREE.Scene;
// //   renderer: THREE.WebGLRenderer;
// //   modelGroup: THREE.Group;
// //   onLoaded?: () => void;
// // }

// // export async function preview3DModel({
// //   url,
// //   scene,
// //   renderer,
// //   modelGroup,
// //   onLoaded,
// // }: Preview3DOptions): Promise<{ mixer?: THREE.AnimationMixer }> {
// //   return new Promise((resolve, reject) => {
// //     const loader = new GLTFLoader();

// //     loader.load(
// //       url,
// //       (gltf) => {
// //         const model = gltf.scene;

// //         const box = new THREE.Box3().setFromObject(model);
// //         const center = box.getCenter(new THREE.Vector3());
// //         const size = box.getSize(new THREE.Vector3());

// //         model.position.sub(center);

// //         const maxDim = Math.max(size.x, size.y, size.z);
// //         const scale = 4 / maxDim;
// //         model.scale.setScalar(scale);

// //         modelGroup.clear();
// //         modelGroup.add(model);

// //         if (onLoaded) onLoaded();

// //         const mixer = gltf.animations.length
// //           ? new THREE.AnimationMixer(model)
// //           : undefined;

// //         if (mixer) {
// //           gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
// //         }

// //         resolve({ mixer });
// //       },
// //       undefined,
// //       (error) => {
// //         console.error("3D model load error:", error);
// //         reject(error);
// //       }
// //     );
// //   });
// // }


// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// export interface Preview3DOptions {
//   url: string;
//   scene: THREE.Scene;
//   renderer: THREE.WebGLRenderer;
//   modelGroup: THREE.Group;
//   onLoaded?: () => void;
//   useEnvironmentMap?: boolean;
// }

// export async function preview3DModel({
//   url,
//   scene,
//   renderer,
//   modelGroup,
//   onLoaded,
//   useEnvironmentMap = true,
// }: Preview3DOptions): Promise<{ mixer?: THREE.AnimationMixer }> {
  
//   // Setup enhanced renderer settings
//   setupRenderer(renderer);
  
//   // Setup proper lighting
//   setupEnhancedLighting(scene, useEnvironmentMap);

//   return new Promise((resolve, reject) => {
//     const loader = new GLTFLoader();

//     loader.load(
//       url,
//       (gltf) => {
//         const model = gltf.scene;

//         // Process materials to ensure they render properly
//         processMaterials(model, scene);

//         // Center and scale model
//         const box = new THREE.Box3().setFromObject(model);
//         const center = box.getCenter(new THREE.Vector3());
//         const size = box.getSize(new THREE.Vector3());

//         model.position.sub(center);

//         const maxDim = Math.max(size.x, size.y, size.z);
//         const scale = 4 / maxDim;
//         model.scale.setScalar(scale);

//         modelGroup.clear();
//         modelGroup.add(model);

//         if (onLoaded) onLoaded();

//         const mixer = gltf.animations.length
//           ? new THREE.AnimationMixer(model)
//           : undefined;

//         if (mixer) {
//           gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
//         }

//         resolve({ mixer });
//       },
//       undefined,
//       (error) => {
//         console.error("3D model load error:", error);
//         reject(error);
//       }
//     );
//   });
// }

// function setupRenderer(renderer: THREE.WebGLRenderer) {
//   // Enhanced renderer settings for better material rendering
//   renderer.outputColorSpace = THREE.SRGBColorSpace;
//   renderer.toneMapping = THREE.ACESFilmicToneMapping;
//   renderer.toneMappingExposure = 1.2; // Increased exposure
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// }

// function setupEnhancedLighting(scene: THREE.Scene, useEnvironmentMap: boolean) {
//   // Clear existing lights
//   const lightsToRemove: THREE.Light[] = [];
//   scene.traverse((child) => {
//     if (child instanceof THREE.Light) {
//       lightsToRemove.push(child);
//     }
//   });
//   lightsToRemove.forEach(light => scene.remove(light));

//   if (useEnvironmentMap) {
//     // Create a simple procedural environment map
//     createProceduralEnvironment(scene);
//   }

//   // Enhanced lighting setup
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//   scene.add(ambientLight);

//   // Key light (main directional light)
//   const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
//   keyLight.position.set(10, 10, 5);
//   keyLight.castShadow = true;
//   keyLight.shadow.mapSize.width = 2048;
//   keyLight.shadow.mapSize.height = 2048;
//   keyLight.shadow.camera.near = 0.5;
//   keyLight.shadow.camera.far = 50;
//   scene.add(keyLight);

//   // Fill light (softer, opposite side)
//   const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.8); // Sky blue tint
//   fillLight.position.set(-10, 5, -5);
//   scene.add(fillLight);

//   // Rim light (for edge definition)
//   const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
//   rimLight.position.set(0, 5, -10);
//   scene.add(rimLight);

//   // Hemisphere light for natural ambient lighting
//   const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x333333, 0.6);
//   scene.add(hemisphereLight);
// }

// function createProceduralEnvironment(scene: THREE.Scene) {
//   // Create a simple gradient environment map
//   const pmremGenerator = new THREE.PMREMGenerator(scene.userData.renderer);
//   const envScene = new THREE.Scene();
  
//   // Create gradient background
//   const geometry = new THREE.SphereGeometry(100, 32, 16);
//   const material = new THREE.ShaderMaterial({
//     side: THREE.BackSide,
//     vertexShader: `
//       varying vec3 vWorldPosition;
//       void main() {
//         vec4 worldPosition = modelMatrix * vec4(position, 1.0);
//         vWorldPosition = worldPosition.xyz;
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
//     `,
//     fragmentShader: `
//       uniform float topColor;
//       uniform float bottomColor;
//       varying vec3 vWorldPosition;
//       void main() {
//         float h = normalize(vWorldPosition + vec3(0.0, 100.0, 0.0)).y;
//         gl_FragColor = vec4(mix(vec3(0.9, 0.9, 1.0), vec3(0.5, 0.7, 1.0), max(pow(h, 2.0), 0.0)), 1.0);
//       }
//     `
//   });
  
//   const sky = new THREE.Mesh(geometry, material);
//   envScene.add(sky);
  
//   const envTexture = pmremGenerator.fromScene(envScene).texture;
//   scene.environment = envTexture;
  
//   pmremGenerator.dispose();
// }

// function processMaterials(model: THREE.Object3D, scene: THREE.Scene) {
//   model.traverse((child) => {
//     if (child instanceof THREE.Mesh) {
//       const material = child.material;
      
//       if (Array.isArray(material)) {
//         material.forEach(mat => enhanceMaterial(mat, scene));
//       } else {
//         enhanceMaterial(material, scene);
//       }
//     }
//   });
// }

// function enhanceMaterial(material: THREE.Material, scene: THREE.Scene) {
//   if (material instanceof THREE.MeshStandardMaterial || 
//       material instanceof THREE.MeshPhysicalMaterial) {
    
//     // Ensure proper environment map usage
//     if (scene.environment && !material.envMap) {
//       material.envMap = scene.environment;
//     }
    
//     // Enhance material properties for better appearance
//     if (material instanceof THREE.MeshStandardMaterial) {
//       // Boost roughness slightly if too shiny
//       if (material.roughness < 0.1) {
//         material.roughness = 0.3;
//       }
      
//       // Ensure metalness is properly set
//       if (material.metalness === undefined) {
//         material.metalness = 0.0;
//       }
//     }
    
//     // Force material update
//     material.needsUpdate = true;
//   }
  
//   // Convert basic materials to standard materials for better lighting
//   else if (material instanceof THREE.MeshBasicMaterial) {
//     const standardMat = new THREE.MeshStandardMaterial({
//       map: material.map,
//       color: material.color,
//       transparent: material.transparent,
//       opacity: material.opacity,
//       roughness: 0.8,
//       metalness: 0.0,
//     });
    
//     // Note: You would need to replace the material on the mesh
//     // This is a simplified example
//   }
// }

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export interface Preview3DOptions {
  url: string;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  modelGroup: THREE.Group;
  onLoaded?: () => void;
  useEnvironmentMap?: boolean;
}

export async function preview3DModel({
  url,
  scene,
  renderer,
  modelGroup,
  onLoaded,
  useEnvironmentMap = true,
}: Preview3DOptions): Promise<{ mixer?: THREE.AnimationMixer }> {
  
  // Setup minimal renderer settings to preserve original properties
  setupMinimalRenderer(renderer);
  
  // Setup conservative lighting that doesn't override model materials
  setupConservativeLighting(scene, useEnvironmentMap);

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;

        // Preserve original materials with minimal processing
        preserveOriginalMaterials(model, scene, useEnvironmentMap);

        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        model.scale.setScalar(scale);

        modelGroup.clear();
        modelGroup.add(model);

        if (onLoaded) onLoaded();

        const mixer = gltf.animations.length > 0
          ? new THREE.AnimationMixer(model)
          : undefined;

        if (mixer && gltf.animations.length > 0) {
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }

        resolve({ mixer });
      },
      undefined,
      (error) => {
        console.error("3D model load error:", error);
        reject(error);
      }
    );
  });
}

function setupMinimalRenderer(renderer: THREE.WebGLRenderer) {
  // Minimal renderer settings that preserve original material properties
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  
  // Only enable tone mapping if materials look too dark
  renderer.toneMapping = THREE.NoToneMapping; // Start with no tone mapping
  renderer.toneMappingExposure = 1.0; // Neutral exposure
  
  // Disable shadows initially to preserve original look
  renderer.shadowMap.enabled = false;
}

function setupConservativeLighting(scene: THREE.Scene, useEnvironmentMap: boolean) {
  // Clear existing lights
  const lightsToRemove: THREE.Light[] = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Light) {
      lightsToRemove.push(child);
    }
  });
  lightsToRemove.forEach(light => scene.remove(light));

  // Create subtle environment map if requested
  if (useEnvironmentMap) {
    createSubtleEnvironment(scene);
  }

  // Minimal lighting setup that doesn't override material properties
  
  // Very subtle ambient light to prevent pure black areas
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Main directional light (not too strong)
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
  mainLight.position.set(5, 10, 5);
  scene.add(mainLight);

  // Subtle fill light from opposite side
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  // Very subtle hemisphere light for natural ambient
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.2);
  scene.add(hemisphereLight);
}

function createSubtleEnvironment(scene: THREE.Scene) {
  // Create a very subtle environment map that doesn't override material properties
  const pmremGenerator = new THREE.PMREMGenerator(scene.userData.renderer);
  pmremGenerator.compileEquirectangularShader();
  
  // Create neutral environment scene
  const envScene = new THREE.Scene();
  
  // Create simple neutral background
  const geometry = new THREE.SphereGeometry(50, 32, 16);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y;
        // Very neutral gradient
        vec3 topColor = vec3(0.95, 0.95, 0.98);
        vec3 bottomColor = vec3(0.85, 0.85, 0.88);
        gl_FragColor = vec4(mix(bottomColor, topColor, max(h * 0.5 + 0.5, 0.0)), 1.0);
      }
    `
  });
  
  const sky = new THREE.Mesh(geometry, material);
  envScene.add(sky);
  
  const envTexture = pmremGenerator.fromScene(envScene).texture;
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  
  // Set environment with reduced intensity
  scene.environment = envTexture;
  scene.environmentIntensity = 0.3; // Very subtle environment influence
  
  pmremGenerator.dispose();
}

function preserveOriginalMaterials(model: THREE.Object3D, scene: THREE.Scene, useEnvironmentMap: boolean) {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach((material) => {
        // Store original properties before any modifications
        const originalProperties = {
          color: material.color?.clone(),
          emissive: material.emissive?.clone(),
          roughness: material.roughness,
          metalness: material.metalness,
          opacity: material.opacity,
          transparent: material.transparent,
        };

        // Only make minimal necessary adjustments
        if (material instanceof THREE.MeshStandardMaterial || 
            material instanceof THREE.MeshPhysicalMaterial) {
          
          // Only set environment map if it doesn't already have one and useEnvironmentMap is true
          if (useEnvironmentMap && !material.envMap && scene.environment) {
            material.envMap = scene.environment;
            material.envMapIntensity = 0.2; // Very subtle environment reflection
          }
          
          // Don't modify existing roughness/metalness values
          // Only set defaults if they're undefined or null
          if (material.roughness === undefined || material.roughness === null) {
            material.roughness = 0.5; // Neutral default
          }
          
          if (material.metalness === undefined || material.metalness === null) {
            material.metalness = 0.0; // Non-metallic default
          }
          
          // Preserve original color and emissive properties
          if (originalProperties.color && material.color) {
            material.color.copy(originalProperties.color);
          }
          
          if (originalProperties.emissive && material.emissive) {
            material.emissive.copy(originalProperties.emissive);
          }
          
        }
        
        // Convert MeshBasicMaterial to MeshStandardMaterial only if necessary
        else if (material instanceof THREE.MeshBasicMaterial) {
          // Only convert if the model looks too flat without proper lighting
          // In most cases, preserve the basic material
          material.needsUpdate = true;
        }
        
        // Ensure Lambert materials work with lighting
        else if (material instanceof THREE.MeshLambertMaterial) {
          // Lambert materials should work fine with basic lighting
          material.needsUpdate = true;
        }
        
        // Force material update to apply any changes
        material.needsUpdate = true;
      });
      
      // Ensure the mesh receives shadows appropriately
      child.castShadow = false; // Disable initially to preserve original look
      child.receiveShadow = false;
    }
  });
}