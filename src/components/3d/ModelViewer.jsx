import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({ modelUrl, roomMode = false }) {
  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage
            environment={roomMode ? "apartment" : "studio"}
            intensity={0.5}
          >
            <Model url={modelUrl} />
          </Stage>
        </Suspense>
        <OrbitControls
          autoRotate={!roomMode}
          enablePan={roomMode}
          enableZoom
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}

// Room environment component for "Try in Your Room" feature
export function RoomViewer({
  modelUrl,
  wallColor = "#ffffff",
  floorTexture = "wood",
}) {
  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Room environment */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial
              color={floorTexture === "wood" ? "#8B4513" : "#808080"}
            />
          </mesh>
          <mesh position={[0, 4, -5]} receiveShadow>
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial color={wallColor} />
          </mesh>
          <mesh
            rotation={[0, -Math.PI / 2, 0]}
            position={[-10, 4, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial color={wallColor} />
          </mesh>
          <mesh
            rotation={[0, Math.PI / 2, 0]}
            position={[10, 4, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial color={wallColor} />
          </mesh>

          {/* Furniture model */}
          <Stage
            environment="apartment"
            intensity={0.5}
            contactShadow={{ opacity: 0.5, blur: 2 }}
          >
            <Model url={modelUrl} />
          </Stage>

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[0, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
        </Suspense>
        <OrbitControls
          enablePan
          enableZoom
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
