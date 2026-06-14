"use client";

import { ThreeCanvas } from "@remotion/three";
import { Player } from "@remotion/player";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

/**
 * A Remotion + three.js clip: a steam locomotive on a slow turntable, steaming,
 * used as the footer's "publisher's mark". Rendered side-profile (length along X)
 * and rotated about Y by frame so all sides read.
 */

const STEEL = "#3a332b";
const STEEL_DARK = "#211c16";
const BRASS = "#c8973f";
const OXBLOOD = "#b4472b";
const EMBER = "#ff7a33";
const LAMP = "#ffd27a";

const DURATION = 180;
const FPS = 30;

function Wheel({ x }: { x: number }) {
  return (
    <group position={[x, 5, 0]}>
      {[10, -10].map((z) => (
        <group key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[7, 7, 2.4, 22]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.6} roughness={0.45} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[7.2, 7.2, 0.7, 22]} />
            <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh>
            <boxGeometry args={[1.6, 13, 2.6]} />
            <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LocoClipScene() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const spin = interpolate(frame, [0, durationInFrames], [-0.5, Math.PI * 2 - 0.5]);
  const bob = Math.sin(frame * 0.18) * 0.5;

  return (
    <>
      <ambientLight intensity={0.7} color="#6a5236" />
      <directionalLight position={[40, 60, 50]} intensity={2.4} color="#ffe7c4" />
      <directionalLight position={[-50, 10, -30]} intensity={0.8} color="#9a5a44" />
      <pointLight position={[10, 6, 0]} intensity={40} color={EMBER} distance={90} decay={1.6} />

      <group rotation={[0, spin, 0]} position={[0, bob, 0]} scale={0.62}>
        {/* footplate */}
        <mesh position={[-2, 2, 0]}>
          <boxGeometry args={[72, 5, 26]} />
          <meshStandardMaterial color={STEEL_DARK} metalness={0.55} roughness={0.5} />
        </mesh>

        {/* buffer beam (front +X) */}
        <mesh position={[34, 6, 0]}>
          <boxGeometry args={[5, 11, 26]} />
          <meshStandardMaterial color={OXBLOOD} metalness={0.4} roughness={0.5} />
        </mesh>

        {/* boiler */}
        <mesh position={[6, 15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[9, 9, 40, 26]} />
          <meshStandardMaterial color={STEEL} metalness={0.65} roughness={0.4} />
        </mesh>
        {/* smokebox */}
        <mesh position={[27, 15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[9.4, 9.4, 8, 26]} />
          <meshStandardMaterial color={STEEL_DARK} metalness={0.6} roughness={0.5} />
        </mesh>
        {/* brass bands */}
        {[-2, 14].map((x) => (
          <mesh key={x} position={[x, 15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[9.1, 0.8, 8, 30]} />
            <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        {/* dome */}
        <mesh position={[2, 25, 0]}>
          <sphereGeometry args={[4.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.32} />
        </mesh>
        {/* chimney */}
        <mesh position={[22, 26, 0]}>
          <cylinderGeometry args={[3.2, 3.8, 10, 18]} />
          <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.45} />
        </mesh>
        <mesh position={[22, 31, 0]}>
          <cylinderGeometry args={[3.9, 3.9, 1.6, 18]} />
          <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.3} />
        </mesh>
        {/* headlamp */}
        <mesh position={[33, 18, 0]}>
          <sphereGeometry args={[2.6, 14, 14]} />
          <meshStandardMaterial color={LAMP} emissive={LAMP} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>

        {/* cab */}
        <mesh position={[-22, 18, 0]}>
          <boxGeometry args={[20, 22, 22]} />
          <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.45} />
        </mesh>
        <mesh position={[-22, 30, 0]}>
          <boxGeometry args={[23, 2.4, 25]} />
          <meshStandardMaterial color={STEEL_DARK} metalness={0.55} roughness={0.5} />
        </mesh>
        {/* warm cab windows */}
        {[12, -12].map((z) => (
          <mesh key={z} position={[-22, 20, z]}>
            <boxGeometry args={[9, 9, 0.6]} />
            <meshStandardMaterial color={EMBER} emissive={EMBER} emissiveIntensity={1.7} toneMapped={false} />
          </mesh>
        ))}

        <Wheel x={20} />
        <Wheel x={-2} />
        <Wheel x={-22} />

        {/* steam */}
        {Array.from({ length: 8 }).map((_, i) => {
          const life = (frame / FPS / 2.2 + i / 8) % 1;
          return (
            <mesh key={i} position={[22 - life * 30, 32 + life * 30, 0]} scale={0.5 + life * 2.6}>
              <sphereGeometry args={[3, 10, 10]} />
              <meshBasicMaterial color="#d8cdbb" transparent opacity={(1 - life) * 0.3} depthWrite={false} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

/** The Remotion composition shell — wires the scene into a ThreeCanvas sized to the comp. */
function LocoClipComposition() {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 32, position: [54, 36, 80], near: 1, far: 600 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <LocoClipScene />
    </ThreeCanvas>
  );
}

export function LocoClip({ width = 200, height = 140, className }: { width?: number; height?: number; className?: string }) {
  return (
    <div className={className}>
      <Player
        component={LocoClipComposition}
        durationInFrames={DURATION}
        fps={FPS}
        compositionWidth={260}
        compositionHeight={180}
        loop
        autoPlay
        controls={false}
        acknowledgeRemotionLicense
        style={{ width, height, background: "transparent" }}
        renderLoading={() => null}
      />
    </div>
  );
}
