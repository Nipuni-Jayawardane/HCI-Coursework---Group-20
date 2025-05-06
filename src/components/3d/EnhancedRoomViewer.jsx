import { Suspense, useState, useRef, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useGLTF,
  TransformControls,
  Html,
} from "@react-three/drei";
import { HexColorPicker } from "react-colorful";
import * as THREE from "three";

// Placement spot component
function PlacementSpot({ position, onClick, isHovered }) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <circleGeometry args={[0.5, 32]} />
      <meshStandardMaterial
        color={hovered ? "#4CAF50" : "#8BC34A"}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Generate grid of placement spots
function PlacementSpots({ onSpotClick, selectedFurniture }) {
  const spots = [];
  const gridSize = 4; // 4x4 grid
  const spacing = 2; // 2 units between spots

  for (let x = -gridSize; x <= gridSize; x += 2) {
    for (let z = -gridSize; z <= gridSize; z += 2) {
      spots.push(
        <PlacementSpot
          key={`${x}-${z}`}
          position={[x, -0.99, z]} // Slightly above the floor
          onClick={() => onSpotClick([x, 0, z])}
        />
      );
    }
  }

  return selectedFurniture !== null ? spots : null;
}

// Raycaster component to handle floor clicks
function FloorRaycaster({ onFloorClick }) {
  const { camera, gl } = useThree();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1);
  const raycaster = new THREE.Raycaster();
  const intersection = new THREE.Vector3();

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Check if WebGL context is valid
      if (!gl.getContext()) {
        console.warn("WebGL context not available");
        return;
      }

      const { clientX, clientY } = event;
      const { left, top, width, height } = event.target.getBoundingClientRect();

      const x = ((clientX - left) / width) * 2 - 1;
      const y = -((clientY - top) / height) * 2 + 1;

      raycaster.setFromCamera({ x, y }, camera);
      if (raycaster.ray.intersectPlane(floorPlane, intersection)) {
        console.log("Floor clicked at:", intersection.toArray());
        if (onFloorClick) {
          onFloorClick([intersection.x, 0, intersection.z]);
        }
      }
    },
    [camera, floorPlane, onFloorClick]
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      visible={false}
      onClick={handleClick}
    >
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial />
    </mesh>
  );
}

// Draggable furniture model component
function DraggableFurniture({
  url,
  position,
  rotation,
  color,
  onPositionChange,
  onSelect,
  isSelected,
}) {
  const { scene } = useGLTF(url);
  const meshRef = useRef();

  // Clone the scene and apply material changes
  const clonedScene = scene.clone();
  clonedScene.traverse((node) => {
    if (node.isMesh) {
      node.material = node.material.clone();
      if (color) {
        node.material.color.set(color);
      }
      // Add highlight effect when selected
      if (isSelected) {
        node.material.emissive = new THREE.Color(0x666666);
      } else {
        node.material.emissive = new THREE.Color(0x000000);
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <primitive
        ref={meshRef}
        object={clonedScene}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelect) onSelect();
        }}
      />
    </group>
  );
}

// Room environment component
function Room({ wallColor, floorTexture }) {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={floorTexture === "wood" ? "#8B4513" : "#808080"}
          roughness={floorTexture === "wood" ? 0.8 : 0.2}
        />
      </mesh>

      {/* Walls */}
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
      <mesh rotation={[0, Math.PI / 2, 0]} position={[10, 4, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </>
  );
}

// Controls panel component
function ControlsPanel({
  wallColor,
  floorTexture,
  selectedFurniture,
  onWallColorChange,
  onFloorTextureChange,
  onFurnitureColorChange,
}) {
  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg space-y-4 w-64">
      <div>
        <h3 className="text-sm font-medium mb-2">Wall Color</h3>
        <HexColorPicker color={wallColor} onChange={onWallColorChange} />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Floor Texture</h3>
        <select
          value={floorTexture}
          onChange={(e) => onFloorTextureChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="wood">Hardwood</option>
          <option value="tile">Tile</option>
          <option value="carpet">Carpet</option>
        </select>
      </div>

      {selectedFurniture && (
        <div>
          <h3 className="text-sm font-medium mb-2">Furniture Color</h3>
          <HexColorPicker
            color={selectedFurniture.color}
            onChange={onFurnitureColorChange}
          />
        </div>
      )}
    </div>
  );
}

export default function EnhancedRoomViewer({ initialFurniture }) {
  const [furniture, setFurniture] = useState(
    initialFurniture.map((item) => ({
      ...item,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      color: "#ffffff",
    }))
  );
  const [wallColor, setWallColor] = useState("#ffffff");
  const [floorTexture, setFloorTexture] = useState("wood");
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState(null);

  const selectedFurniture =
    selectedFurnitureIndex !== null ? furniture[selectedFurnitureIndex] : null;

  const handleSpotClick = useCallback(
    (position) => {
      if (selectedFurnitureIndex !== null) {
        setFurniture((prev) =>
          prev.map((item, i) =>
            i === selectedFurnitureIndex ? { ...item, position } : item
          )
        );
        setSelectedFurnitureIndex(null); // Deselect after placing
      }
    },
    [selectedFurnitureIndex]
  );

  const handleFurnitureColorChange = useCallback(
    (color) => {
      if (selectedFurnitureIndex !== null) {
        setFurniture((prev) =>
          prev.map((item, i) =>
            i === selectedFurnitureIndex ? { ...item, color } : item
          )
        );
      }
    },
    [selectedFurnitureIndex]
  );

  const handleSelectFurniture = useCallback((index) => {
    setSelectedFurnitureIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <Room wallColor={wallColor} floorTexture={floorTexture} />

          {/* Placement spots */}
          <PlacementSpots
            onSpotClick={handleSpotClick}
            selectedFurniture={selectedFurniture}
          />

          {/* Furniture items */}
          {furniture.map((item, index) => (
            <DraggableFurniture
              key={item.id}
              url={item.modelUrl}
              position={item.position}
              rotation={item.rotation}
              color={item.color}
              onSelect={() => handleSelectFurniture(index)}
              isSelected={index === selectedFurnitureIndex}
            />
          ))}

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

      <ControlsPanel
        wallColor={wallColor}
        floorTexture={floorTexture}
        selectedFurniture={selectedFurniture}
        onWallColorChange={setWallColor}
        onFloorTextureChange={setFloorTexture}
        onFurnitureColorChange={handleFurnitureColorChange}
      />
    </div>
  );
}
