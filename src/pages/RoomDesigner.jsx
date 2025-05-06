import { useState, useEffect, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  TransformControls,
  Grid as DreiGrid,
} from "@react-three/drei";
import FurnitureModel from "../components/3d/FurnitureModel";
import { products } from "../data/products";
import {
  PlusIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

// Placement spot component
function PlacementSpot({ position, onClick, isHovered }) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(position);
      }}
    >
      <planeGeometry args={[0.6, 0.6]} />
      <meshStandardMaterial
        color={hovered ? "#4CAF50" : "#8BC34A"}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Generate grid of placement spots
function PlacementSpots({ onSpotClick, roomWidth, roomLength, visible }) {
  if (!visible) return null;

  const spots = [];
  const spacingX = 1;
  const spacingZ = 1;

  for (let x = -roomWidth / 2 + 1; x <= roomWidth / 2 - 1; x += spacingX) {
    for (let z = -roomLength / 2 + 1; z <= roomLength / 2 - 1; z += spacingZ) {
      spots.push(
        <PlacementSpot
          key={`${x}-${z}`}
          position={[x, 0.01, z]}
          onClick={onSpotClick}
        />
      );
    }
  }

  return spots;
}

// Room component
function Room({ wallColor = "#ffffff", width = 5, length = 5, height = 3 }) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Walls */}
      <group position={[0, height / 2, 0]}>
        {/* Back wall */}
        <mesh position={[0, 0, -length / 2]} receiveShadow>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>

        {/* Left wall */}
        <mesh
          position={[-width / 2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[length, height]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>

        {/* Right wall */}
        <mesh
          position={[width / 2, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[length, height]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>
      </group>
    </group>
  );
}

// Draggable furniture component
function DraggableFurniture({
  modelUrl,
  position,
  rotation,
  scale,
  color,
  useCustomColor,
  isSelected,
  onSelect,
}) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      groupRef.current.rotation.set(...rotation);
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <group ref={groupRef}>
      <FurnitureModel
        modelPath={modelUrl}
        scale={scale}
        color={useCustomColor ? color : undefined}
        onClick={handleClick}
      />
      {isSelected && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial
            color="yellow"
            emissive="yellow"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

// Add Furniture Button component
function AddFurnitureButton({ onAddFurniture }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-6 bottom-6" style={{ zIndex: 1000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-accent-600 text-white rounded-lg flex items-center space-x-2 shadow-lg hover:bg-accent-700 transition-colors"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Add Furniture</span>
      </button>

      {isOpen && (
        <div
          className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[800px] bg-white rounded-lg shadow-2xl p-4 md:p-6 mx-auto"
          style={{
            zIndex: 9999,
            maxHeight: "90vh",
            overflowY: "auto",
            maxWidth: "800px",
          }}
        >
          <div className="flex justify-between items-center mb-4 md:mb-6 sticky top-0 bg-white pt-2">
            <h3 className="font-medium text-lg md:text-xl">
              Available Furniture
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-2 -mr-2"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {products && products.length > 0 ? (
              products.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onAddFurniture(item);
                    setIsOpen(false);
                  }}
                  className="text-left p-3 md:p-4 hover:bg-gray-50 rounded-lg border border-gray-200 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <div className="aspect-square w-full relative overflow-hidden rounded-lg mb-2 md:mb-3">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-medium text-sm md:text-base mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-accent-600 font-semibold text-sm md:text-base">
                    ${item.price}
                  </p>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No furniture items available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Controls panel component
function ControlsPanel({
  wallColor,
  setWallColor,
  roomWidth,
  setRoomWidth,
  roomLength,
  setRoomLength,
  roomHeight,
  setRoomHeight,
  isOpen,
  onToggle,
  selectedFurnitureIndex,
  roomFurniture,
  setRoomFurniture,
  setSelectedFurnitureIndex,
  setOrbitControlsEnabled,
}) {
  return (
    <>
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        style={{ width: "320px" }}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-medium">Room Settings</h2>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {/* Room Dimensions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Dimensions</h3>
            <div className="space-y-4">
              {/* Width control */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-primary-600">
                  Width: {roomWidth.toFixed(1)}m
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setRoomWidth(Math.max(3, roomWidth - 0.1))}
                    className="px-2 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setRoomWidth(Math.min(10, roomWidth + 0.1))}
                    className="px-2 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Length control */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-primary-600">
                  Length: {roomLength.toFixed(1)}m
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setRoomLength(Math.max(3, roomLength - 0.1))}
                    className="px-2 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      setRoomLength(Math.min(10, roomLength + 0.1))
                    }
                    className="px-2 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Height control */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600">
                  Height: {roomHeight.toFixed(1)}m
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setRoomHeight(Math.max(2, roomHeight - 0.1))}
                    className="px-2 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setRoomHeight(Math.min(4, roomHeight + 0.1))}
                    className="px-2 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wall Color */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Wall Color</h3>
            <input
              type="color"
              value={wallColor}
              onChange={(e) => setWallColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>

          {/* Selected Item Controls */}
          {selectedFurnitureIndex !== null && (
            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">
                Selected Item Controls
              </h3>
              <p className="text-xs mb-2">
                Use WASD or Arrow keys to move the selected item
                <br />
                Q/E to move up/down
                <br />
                R/F to rotate furniture direction
              </p>

              {/* Color Controls - Always show color options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-primary-700">
                    Custom Colors
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        roomFurniture[selectedFurnitureIndex]?.useCustomColor
                      }
                      onChange={(e) => {
                        setRoomFurniture((prev) => {
                          const newFurniture = [...prev];
                          newFurniture[selectedFurnitureIndex] = {
                            ...newFurniture[selectedFurnitureIndex],
                            useCustomColor: e.target.checked,
                            color: e.target.checked
                              ? newFurniture[selectedFurnitureIndex]?.color ||
                                "#FFFFFF"
                              : "#FFFFFF",
                          };
                          return newFurniture;
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="text-sm">Color:</label>
                  <input
                    type="color"
                    value={
                      roomFurniture[selectedFurnitureIndex]?.color || "#FFFFFF"
                    }
                    onChange={(e) => {
                      setRoomFurniture((prev) => {
                        const newFurniture = [...prev];
                        newFurniture[selectedFurnitureIndex] = {
                          ...newFurniture[selectedFurnitureIndex],
                          color: e.target.value,
                          useCustomColor: true,
                        };
                        return newFurniture;
                      });
                    }}
                    className="w-8 h-8 rounded cursor-pointer"
                    disabled={
                      !roomFurniture[selectedFurnitureIndex]?.useCustomColor
                    }
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setRoomFurniture((prev) =>
                    prev.filter((_, index) => index !== selectedFurnitureIndex)
                  );
                  setSelectedFurnitureIndex(null);
                  setOrbitControlsEnabled(true);
                }}
                className="w-full px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm mt-4"
              >
                Delete Item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-l-lg shadow-lg"
      >
        {isOpen ? (
          <ChevronRightIcon className="h-6 w-6" />
        ) : (
          <ChevronLeftIcon className="h-6 w-6" />
        )}
      </button>
    </>
  );
}

export default function RoomDesigner() {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef();
  const [roomFurniture, setRoomFurniture] = useState([]);
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState(null);
  const [wallColor, setWallColor] = useState("#ffffff");
  const [roomWidth, setRoomWidth] = useState(5);
  const [roomLength, setRoomLength] = useState(5);
  const [roomHeight, setRoomHeight] = useState(3);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true);

  // Initialize with the product from navigation state
  useEffect(() => {
    if (location.state?.product) {
      const { product } = location.state;
      setRoomFurniture([
        {
          ...product,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: product.customizations?.scale || 1,
          color: product.customizations?.color || "#FFFFFF",
          useCustomColor: product.customizations?.color ? true : false,
        },
      ]);
    }
  }, [location.state]);

  // Handle keyboard controls
  const handleKeyDown = (e) => {
    if (selectedFurnitureIndex === null) return;

    const key = e.key.toLowerCase();
    console.log("Key pressed:", key);

    setRoomFurniture((prev) => {
      const moveSpeed = 0.1;
      const rotateSpeed = Math.PI / 4; // 45 degrees for more noticeable rotation
      return prev.map((item, i) => {
        if (i !== selectedFurnitureIndex) return item;

        const [x, y, z] = item.position;
        const [rotX, rotY, rotZ] = item.rotation;
        let newPosition = [x, y, z];
        let newRotation = [rotX, rotY, rotZ];

        switch (key) {
          case "w":
          case "arrowup":
            newPosition = [x, y, z - moveSpeed];
            break;
          case "s":
          case "arrowdown":
            newPosition = [x, y, z + moveSpeed];
            break;
          case "a":
          case "arrowleft":
            newPosition = [x - moveSpeed, y, z];
            break;
          case "d":
          case "arrowright":
            newPosition = [x + moveSpeed, y, z];
            break;
          case "q":
            newPosition = [x, y + moveSpeed, z];
            break;
          case "e":
            newPosition = [x, y - moveSpeed, z];
            break;
          case "r": // Y axis clockwise (rotate right)
            newRotation = [rotX, rotY + rotateSpeed, rotZ];
            break;
          case "f": // Y axis counterclockwise (rotate left)
            newRotation = [rotX, rotY - rotateSpeed, rotZ];
            break;
          default:
            return item;
        }

        console.log("Moving from", item.position, "to", newPosition);
        console.log("Rotating from", item.rotation, "to", newRotation);
        return { ...item, position: newPosition, rotation: newRotation };
      });
    });
  };

  const handleAddFurniture = (item) => {
    setRoomFurniture((prev) => [
      ...prev,
      {
        ...item,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1,
        color: "#FFFFFF",
        useCustomColor: false,
      },
    ]);
  };

  const handleFurnitureSelect = (index) => {
    console.log("Selecting furniture:", index);
    setSelectedFurnitureIndex(index);
    setOrbitControlsEnabled(false);
  };

  const handleSpotClick = (position) => {
    console.log("Spot clicked at position:", position);
    if (selectedFurnitureIndex !== null) {
      setRoomFurniture((prev) => {
        const newFurniture = [...prev];
        newFurniture[selectedFurnitureIndex] = {
          ...newFurniture[selectedFurnitureIndex],
          position: position,
        };
        return newFurniture;
      });
      setSelectedFurnitureIndex(null);
      setOrbitControlsEnabled(true);
    }
  };

  const handleCanvasClick = (e) => {
    // Only deselect if clicking on the canvas background
    if (e.target === canvasRef.current) {
      console.log("Canvas background clicked, deselecting furniture");
      setSelectedFurnitureIndex(null);
      setOrbitControlsEnabled(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Room Designer */}
      <div
        className="relative h-[calc(100vh-80px)]"
        onClick={handleCanvasClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={canvasRef}
        style={{ outline: "none" }}
      >
        <AddFurnitureButton onAddFurniture={handleAddFurniture} />
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 60 }}>
          <Suspense fallback={null}>
            <Room
              wallColor={wallColor}
              width={roomWidth}
              length={roomLength}
              height={roomHeight}
            />

            <PlacementSpots
              onSpotClick={handleSpotClick}
              roomWidth={roomWidth}
              roomLength={roomLength}
              visible={selectedFurnitureIndex !== null}
            />

            {roomFurniture.map((item, index) => (
              <DraggableFurniture
                key={index}
                modelUrl={item.modelUrl}
                position={item.position}
                rotation={item.rotation}
                scale={item.scale}
                color={item.color}
                useCustomColor={item.useCustomColor}
                isSelected={selectedFurnitureIndex === index}
                onSelect={() => handleFurnitureSelect(index)}
              />
            ))}

            <DreiGrid
              infiniteGrid
              cellSize={1}
              sectionSize={1}
              fadeDistance={30}
              fadeStrength={1}
            />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <OrbitControls
              makeDefault
              enabled={orbitControlsEnabled}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
              enableDamping={false}
            />
            <Environment preset="apartment" />
          </Suspense>
        </Canvas>

        {/* Controls Panel */}
        <ControlsPanel
          wallColor={wallColor}
          setWallColor={setWallColor}
          roomWidth={roomWidth}
          setRoomWidth={setRoomWidth}
          roomLength={roomLength}
          setRoomLength={setRoomLength}
          roomHeight={roomHeight}
          setRoomHeight={setRoomHeight}
          isOpen={controlsOpen}
          onToggle={() => setControlsOpen(!controlsOpen)}
          selectedFurnitureIndex={selectedFurnitureIndex}
          roomFurniture={roomFurniture}
          setRoomFurniture={setRoomFurniture}
          setSelectedFurnitureIndex={setSelectedFurnitureIndex}
          setOrbitControlsEnabled={setOrbitControlsEnabled}
        />
      </div>
    </div>
  );
}
