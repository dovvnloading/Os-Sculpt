
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { BrushSettings, ToolType } from '../types';

interface SculptCanvasProps {
  tool: ToolType;
  brush: BrushSettings;
}

interface SculptMeshProps extends SculptCanvasProps {
  setControlsEnabled: (enabled: boolean) => void;
}

// History snapshot now contains both positions and colors
interface HistorySnapshot {
    positions: Float32Array;
    colors: Float32Array;
}

// Custom mesh that handles the sculpting logic
const SculptMesh: React.FC<SculptMeshProps> = ({ tool, brush, setControlsEnabled }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hoverPoint, setHoverPoint] = useState<THREE.Vector3 | null>(null);
  const [hoverNormal, setHoverNormal] = useState<THREE.Vector3 | null>(null);
  
  // History State
  const MAX_HISTORY = 20;
  const historyRef = useRef<HistorySnapshot[]>([]);
  const historyPointerRef = useRef<number>(-1);

  // Geometry configuration
  // Increased to 200 (approx 40k verts) for smoother painting resolution
  const SEGMENTS = 200; 
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(2, SEGMENTS, SEGMENTS);
    // Initialize vertex colors (default to light grey)
    const count = geo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        colors[i] = 0.8; // Base grey
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Initialize history
  useEffect(() => {
    if (meshRef.current && historyRef.current.length === 0) {
        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
        const colors = meshRef.current.geometry.attributes.color.array as Float32Array;
        
        // Save initial state
        const initialSnapshot: HistorySnapshot = {
            positions: new Float32Array(positions),
            colors: new Float32Array(colors)
        };
        historyRef.current.push(initialSnapshot);
        historyPointerRef.current = 0;
    }
  }, []);

  // Export Logic
  useEffect(() => {
    const handleExport = () => {
      if (!meshRef.current) return;

      const geo = meshRef.current.geometry;
      const positions = geo.attributes.position.array;
      const indices = geo.index ? geo.index.array : null;

      let output = "# Os-s Export\no object\n";

      // Write Vertices
      // OBJ format: v x y z
      for (let i = 0; i < positions.length; i += 3) {
        output += `v ${positions[i]} ${positions[i+1]} ${positions[i+2]}\n`;
      }

      // Write Faces
      // OBJ format: f v1 v2 v3 (indices are 1-based)
      if (indices) {
        for (let i = 0; i < indices.length; i += 3) {
          output += `f ${indices[i] + 1} ${indices[i+1] + 1} ${indices[i+2] + 1}\n`;
        }
      } else {
          const vertexCount = positions.length / 3;
          for (let i = 0; i < vertexCount; i += 3) {
             output += `f ${i + 1} ${i + 2} ${i + 3}\n`;
          }
      }

      // Create Blob and download
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sculpt_${Date.now()}.obj`;
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
    };

    window.addEventListener('sculpt-export', handleExport);
    return () => window.removeEventListener('sculpt-export', handleExport);
  }, []);

  // Undo/Redo Logic
  useEffect(() => {
    const handleUndo = () => {
        if (historyPointerRef.current > 0) {
            historyPointerRef.current--;
            restoreHistory();
        }
    };

    const handleRedo = () => {
        if (historyPointerRef.current < historyRef.current.length - 1) {
            historyPointerRef.current++;
            restoreHistory();
        }
    };

    const restoreHistory = () => {
        if (!meshRef.current) return;
        const snapshot = historyRef.current[historyPointerRef.current];
        
        const posAttr = meshRef.current.geometry.attributes.position;
        const colAttr = meshRef.current.geometry.attributes.color;

        (posAttr.array as Float32Array).set(snapshot.positions);
        (colAttr.array as Float32Array).set(snapshot.colors);

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        meshRef.current.geometry.computeVertexNormals();
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
            if (e.shiftKey) handleRedo();
            else handleUndo();
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
            handleRedo();
        }
    };
    
    const onUndoEvent = () => handleUndo();
    const onRedoEvent = () => handleRedo();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('sculpt-undo', onUndoEvent);
    window.addEventListener('sculpt-redo', onRedoEvent);

    return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('sculpt-undo', onUndoEvent);
        window.removeEventListener('sculpt-redo', onRedoEvent);
    };
  }, []);

  const saveToHistory = () => {
      if (!meshRef.current) return;
      
      // 1. Trim future history (Redo stack) if we are in the middle
      if (historyPointerRef.current < historyRef.current.length - 1) {
          historyRef.current = historyRef.current.slice(0, historyPointerRef.current + 1);
      }

      // 2. Capture current state
      const geo = meshRef.current.geometry;
      const currentPositions = geo.attributes.position.array as Float32Array;
      const currentColors = geo.attributes.color.array as Float32Array;

      const snapshot: HistorySnapshot = {
          positions: new Float32Array(currentPositions),
          colors: new Float32Array(currentColors)
      };
      
      // 3. Push and limit size
      historyRef.current.push(snapshot);
      if (historyRef.current.length > MAX_HISTORY) {
          historyRef.current.shift();
      }
      
      // 4. Update pointer to the new end
      historyPointerRef.current = historyRef.current.length - 1;
  };

  // Core Sculpting Logic
  const sculpt = (worldPoint: THREE.Vector3) => {
    if (!meshRef.current) return;

    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    const normAttr = geo.attributes.normal;
    const colAttr = geo.attributes.color;
    const count = posAttr.count;

    // Convert world intersection point to local mesh space
    const localPoint = meshRef.current.worldToLocal(worldPoint.clone());
    
    const radius = brush.radius;
    const radiusSq = radius * radius;
    const intensity = brush.intensity * 0.015; 

    const vA = new THREE.Vector3();
    const nA = new THREE.Vector3();
    const tempVec = new THREE.Vector3();

    // Parse Paint Color from brush.paintColor (NOT meshColor)
    const paintColor = new THREE.Color(brush.paintColor);

    // --- Phase 1: Pre-calculation (Average Plane / Center) ---
    let avgPos = new THREE.Vector3();
    let avgNormal = new THREE.Vector3();
    let neighbors = 0;

    if (tool === ToolType.FLATTEN || tool === ToolType.SMOOTH) {
        for (let i = 0; i < count; i++) {
            vA.fromBufferAttribute(posAttr, i);
            if (vA.distanceToSquared(localPoint) < radiusSq) {
                avgPos.add(vA);
                if (tool === ToolType.FLATTEN) {
                    nA.fromBufferAttribute(normAttr, i);
                    avgNormal.add(nA);
                }
                neighbors++;
            }
        }
        if (neighbors > 0) {
            avgPos.divideScalar(neighbors);
            if (tool === ToolType.FLATTEN) avgNormal.normalize();
        }
    }

    // --- Phase 2: Vertex Displacement / Painting ---
    let modifiedGeo = false;
    let modifiedColor = false;

    for (let i = 0; i < count; i++) {
        vA.fromBufferAttribute(posAttr, i);
        const distSq = vA.distanceToSquared(localPoint);

        if (distSq < radiusSq) {
            // Smooth falloff for sculpting
            const falloff = Math.pow(1.0 - distSq / radiusSq, 2); 
            const influence = falloff * intensity;
            
            if (tool === ToolType.PAINT) {
                // Painting Logic
                modifiedColor = true;
                // Existing color
                const r = colAttr.getX(i);
                const g = colAttr.getY(i);
                const b = colAttr.getZ(i);

                // Smoother paint blending (Airbrush style)
                // Use cubic falloff for softer edges to avoid pixelated look
                const paintFalloff = Math.pow(1.0 - distSq / radiusSq, 3);
                // Reduced strength (0.2 multiplier) allows for layering and gradients
                const paintStrength = Math.min(paintFalloff * brush.intensity * 0.2, 1.0); 

                colAttr.setXYZ(
                    i,
                    r + (paintColor.r - r) * paintStrength,
                    g + (paintColor.g - g) * paintStrength,
                    b + (paintColor.b - b) * paintStrength
                );
            } else {
                // Sculpting Logic
                modifiedGeo = true;
                nA.fromBufferAttribute(normAttr, i);

                if (tool === ToolType.BRUSH) {
                    vA.addScaledVector(nA, influence);
                } 
                else if (tool === ToolType.FLATTEN) {
                    if (neighbors > 0) {
                        tempVec.subVectors(vA, avgPos);
                        const distToPlane = tempVec.dot(avgNormal);
                        vA.addScaledVector(avgNormal, -distToPlane * influence * 2.0); 
                    }
                } 
                else if (tool === ToolType.PINCH) {
                    tempVec.subVectors(localPoint, vA);
                    vA.addScaledVector(tempVec, influence * 1.5);
                } 
                else if (tool === ToolType.SMOOTH) {
                    if (neighbors > 0) {
                        tempVec.subVectors(avgPos, vA);
                        vA.addScaledVector(tempVec, influence * 2.0);
                    }
                }
                posAttr.setXYZ(i, vA.x, vA.y, vA.z);
            }
        }
    }

    if (modifiedGeo) {
        posAttr.needsUpdate = true;
        geo.computeVertexNormals();
    }
    if (modifiedColor) {
        colAttr.needsUpdate = true;
    }
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation(); 
    if (e.button === 0) { 
        setControlsEnabled(false); // Lock camera
        sculpt(e.point);
        (e.target as Element).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    setHoverPoint(e.point.clone());
    if (e.face) {
        setHoverNormal(e.face.normal.clone().transformDirection(meshRef.current!.matrixWorld));
    }
    if (e.buttons === 1) {
        e.stopPropagation();
        sculpt(e.point);
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setControlsEnabled(true);
      saveToHistory();
      if (meshRef.current) {
          meshRef.current.geometry.computeBoundingSphere(); 
      }
      (e.target as Element).releasePointerCapture(e.pointerId);
  };
  
  const handlePointerLeave = () => {
      setHoverPoint(null);
      setHoverNormal(null);
  };

  const getMaterial = () => {
    const { wireframe, material, meshColor } = brush;
    // Use meshColor for the global material tint
    // vertexColors is true, so this color multiplies with the vertex colors.
    // White (default) means vertex colors show true.
    const common = { color: meshColor, wireframe, flatShading: false, vertexColors: true };

    if (material === 'clay') return <meshStandardMaterial {...common} roughness={0.8} metalness={0.1} />;
    if (material === 'metallic') return <meshStandardMaterial {...common} roughness={0.2} metalness={0.9} />;
    return <meshStandardMaterial {...common} roughness={0.5} metalness={0.5} />;
  };

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        castShadow
        receiveShadow
      >
        {getMaterial()}
      </mesh>
      
      {/* 3D Cursor Visual */}
      {hoverPoint && (
        <group position={hoverPoint}>
            {/* Brush Radius Ring */}
            <mesh 
                ref={(node) => {
                    if (node && hoverNormal) node.lookAt(hoverPoint.clone().add(hoverNormal));
                }}
            >
                <ringGeometry args={[brush.radius * 0.95, brush.radius, 64]} />
                <meshBasicMaterial 
                    color={
                        tool === ToolType.PAINT ? brush.paintColor :
                        tool === ToolType.SMOOTH ? "#4ade80" : 
                        tool === ToolType.FLATTEN ? "#f87171" : 
                        tool === ToolType.PINCH ? "#a78bfa" : 
                        "orange"
                    } 
                    transparent 
                    opacity={0.6} 
                    side={THREE.DoubleSide} 
                    depthTest={false} 
                />
            </mesh>
            
            {/* Center Dot */}
            <mesh>
                <sphereGeometry args={[brush.radius * 0.05, 8, 8]} />
                <meshBasicMaterial color={tool === ToolType.PAINT ? brush.paintColor : "white"} depthTest={false} />
            </mesh>

             {/* Normal Indicator Line */}
             {hoverNormal && tool !== ToolType.PAINT && (
                <line>
                    <bufferGeometry attach="geometry" onUpdate={geo => {
                        geo.setFromPoints([new THREE.Vector3(0,0,0), hoverNormal.clone().multiplyScalar(brush.radius * 0.5)]);
                    }} />
                    <lineBasicMaterial attach="material" color="white" opacity={0.4} transparent />
                </line>
            )}
        </group>
      )}
    </>
  );
};

export const SculptCanvas: React.FC<SculptCanvasProps> = (props) => {
  const [controlsEnabled, setControlsEnabled] = useState(true);

  return (
    <div className="w-full h-full bg-[#0a0a0a] relative select-none">
        <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }} dpr={[1, 2]}>
            <color attach="background" args={['#0a0a0a']} />
            <fog attach="fog" args={['#0a0a0a', 8, 25]} />
            
            <Environment preset="city" />
            <ambientLight intensity={0.3} />
            
            <directionalLight 
                position={[5, 8, 5]} 
                intensity={1.2} 
                castShadow 
                shadow-mapSize={[2048, 2048]} 
                shadow-bias={-0.0005}
            />
            
            <SculptMesh {...props} setControlsEnabled={setControlsEnabled} />
            
            <OrbitControls 
                makeDefault 
                enabled={controlsEnabled}
                enableDamping 
                dampingFactor={0.1} 
                minDistance={3} 
                maxDistance={15} 
                rotateSpeed={0.6}
                zoomSpeed={0.8}
            />
            
            <Grid 
                args={[20, 20]} 
                cellSize={1} 
                cellThickness={1} 
                cellColor="#222" 
                sectionSize={5} 
                sectionThickness={1.2} 
                sectionColor="#333" 
                fadeDistance={20} 
                position={[0, -2.5, 0]}
            />
        </Canvas>
        
        {/* Viewport Info Overlay */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1 pointer-events-none">
            <div className="flex gap-3 text-[10px] text-neutral-400 font-mono bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/5">
                <span>CAM: PERSP</span>
                <span>FOV: 45</span>
            </div>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-3 left-3 text-[10px] text-neutral-600 font-mono pointer-events-none select-none flex flex-col gap-0.5">
            <div className="flex items-center gap-2 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${controlsEnabled ? 'bg-green-500/80' : 'bg-orange-500/80'}`}></span>
                <span className="text-neutral-500">{controlsEnabled ? 'READY' : 'ACTIVE'}</span>
            </div>
            <div className="text-neutral-500">VERTS: ~40k</div>
            <div className="text-neutral-500">MODE: {props.tool}</div>
        </div>
    </div>
  );
};

export default SculptCanvas;
