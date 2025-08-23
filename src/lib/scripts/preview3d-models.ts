import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export interface Preview3DOptions {
  url: string;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  modelGroup: THREE.Group;
  onLoaded?: () => void;
  rotation?: number[]
}


export async function preview3DModel({
  url,
  scene,
  renderer,
  modelGroup,
  onLoaded,
  rotation = [0, 0, 0],
}: {
  url: string;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  modelGroup: THREE.Group;
  onLoaded: () => void;
  rotation?: number[];
}) {
  const loader = new GLTFLoader();

  return new Promise<{ mixer?: THREE.AnimationMixer }>((resolve) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.rotation.set(rotation[0],rotation[1],rotation[2]);

        // 1. Create wrapper group for centering
        const centeredGroup = new THREE.Group();
        centeredGroup.add(model);

        // 2. Compute bounding box and center it
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Shift model so it's centered at (0, 0, 0)
        model.position.sub(center);

        // 3. Uniformly scale model
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 4;
        const scale = targetSize / maxDim;
        centeredGroup.scale.setScalar(scale);

        // 4. Add to parent model group
        modelGroup.add(centeredGroup);

        onLoaded();

        resolve({ mixer: gltf.animations?.length ? new THREE.AnimationMixer(model) : undefined });
      },
      undefined,
      (err) => {
        console.error("Model load error", err);
        resolve({});
      }
    );
  });
}


export async function load3DModelWithAnimations({
  url,
  scene,
  renderer,
  modelGroup,
  onLoaded,
  rotation = [0, 0, 0],
}: {
  url: string;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  modelGroup: THREE.Group;
  onLoaded: () => void;
  rotation?: number[];
}) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      url,
        (gltf) => {
             const model = gltf.scene;
     
             // Compute bounding box
             const box = new THREE.Box3().setFromObject(model);
             const size = new THREE.Vector3();
             const center = new THREE.Vector3();
             box.getSize(size);
             box.getCenter(center);
     
             // Center and scale
             model.position.sub(center);
             const maxDim = Math.max(size.x, size.y, size.z);
             const scale = 4.5 / maxDim;
             model.scale.setScalar(scale);
     
             // model.rotation.set(0, 0, 0);
             // model.rotation.y = Math.PI - Math.PI/2;
             if (rotation) {
               model.rotation.set(rotation[0],rotation[1],rotation[2]);
             } else {
               model.rotation.set(0, Math.PI, 0);
             }
     
             // Reset previous
             modelGroup.clear();
             modelGroup.add(model);
     
             scene.add(modelGroup);
     
             const mixer =
               gltf.animations.length > 0
                 ? new THREE.AnimationMixer(model)
                 : undefined;
     
             if (mixer) {
               gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
             }
     
             if (onLoaded) onLoaded();
             resolve({ model, mixer });
           },
      (progress) => {
        // Optional: Handle loading progress
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("Error loading 3D model:", error);
        reject(error);
      }
    );
  });
}
