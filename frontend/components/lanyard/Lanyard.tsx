/* eslint-disable react/no-unknown-property */
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

// ── Patch THREE.Clock before Rapier uses it ─────────────────────
// THREE.Clock was deprecated in r168 but Rapier still uses it internally.
// This shim keeps it working without crashing.
if (typeof (THREE as any).Clock === 'undefined') {
  (THREE as any).Clock = class PatchedClock {
    private _start = false;
    private _startTime = 0;
    private _oldTime = 0;
    private _elapsedTime = 0;
    autoStart: boolean;
    constructor(autoStart = true) { this.autoStart = autoStart; }
    start() { this._startTime = this._oldTime = Date.now() / 1000; this._elapsedTime = 0; this._start = true; }
    stop() { this.getElapsedTime(); this._start = false; this.autoStart = false; }
    getElapsedTime() { this.getDelta(); return this._elapsedTime; }
    getDelta() {
      let diff = 0;
      if (this.autoStart && !this._start) { this.start(); return 0; }
      if (this._start) {
        const now = Date.now() / 1000;
        diff = now - this._oldTime;
        this._oldTime = now;
        this._elapsedTime += diff;
      }
      return diff;
    }
  };
}


// ─── Assets (served from /public) ────────────────────────────────
const CARD_GLB = '/assets/lanyard/card.glb';
const LANYARD_PNG = '/assets/lanyard/lanyard.png';

// Blank 1×1 transparent pixel for safe useTexture fallback
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Card texture atlas UV rects
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT  = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

// Register meshline custom elements with R3F
extend({ MeshLineGeometry, MeshLineMaterial });

// ─── Extend R3F's JSX namespace so meshLineGeometry/meshLineMaterial compile ──
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial:  any;
  }
}

// ─── Types ───────────────────────────────────────────────────────
export interface LanyardProps {
  position?:     [number, number, number];
  gravity?:      [number, number, number];
  fov?:          number;
  transparent?:  boolean;
  frontImage?:   string | null;
  backImage?:    string | null;
  imageFit?:    'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

interface BandProps {
  maxSpeed?:     number;
  minSpeed?:     number;
  isMobile?:     boolean;
  frontImage?:   string | null;
  backImage?:    string | null;
  imageFit?:    'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

// ─── Lanyard (exported) ──────────────────────────────────────────
export default function Lanyard({
  position    = [0, 0, 30],
  gravity     = [0, -40, 0],
  fov         = 20,
  transparent = true,
  frontImage  = null,
  backImage   = null,
  imageFit    = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative z-0 w-full h-full flex justify-center items-center">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, preserveDrawingBuffer: false, antialias: true }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
        style={{ width: '100%', height: '100%' }}
      >
        {/* Suspense is required: useGLTF and useTexture suspend while loading.
            Without it, WebGL receives unloaded images → texSubImage2D error → context lost. */}
        <Suspense fallback={null}>
          <ambientLight intensity={Math.PI} />
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer intensity={2}  color="white" position={[0, -1, 5]}   rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3}  color="white" position={[-1, -1, 1]}  rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3}  color="white" position={[1, 1, 1]}    rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

// ─── Band (rope + card physics) ──────────────────────────────────
function Band({
  maxSpeed     = 50,
  minSpeed     = 0,
  isMobile     = false,
  frontImage   = null,
  backImage    = null,
  imageFit     = 'cover' as 'cover' | 'contain',
  lanyardImage = null,
  lanyardWidth = 1,
}: BandProps) {
  // Use unknown here to avoid the BufferGeometry<> vs MeshLineGeometry type mismatch
  const band  = useRef<THREE.Mesh<any, any>>(null!);
  const fixed = useRef<any>(null!);
  const j1    = useRef<any>(null!);
  const j2    = useRef<any>(null!);
  const j3    = useRef<any>(null!);
  const card  = useRef<any>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping:  4,
  };

  const { nodes, materials } = useGLTF(CARD_GLB) as any;
  const texture   = useTexture(lanyardImage || LANYARD_PNG);
  // useTexture must always be called — use BLANK_PIXEL when no image
  const frontTex  = useTexture(frontImage  || BLANK_PIXEL);
  const backTex   = useTexture(backImage   || BLANK_PIXEL);

  // Composite front/back images into the card's texture atlas
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image as HTMLImageElement;
    const W = baseImg.width;
    const H = baseImg.height;

    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;

    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (
      img:  HTMLImageElement,
      rect: { x: number; y: number; w: number; h: number }
    ) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick  = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw    = img.width  * scale;
      const dh    = img.height * scale;
      const dx    = rx + (rw - dw) / 2;
      const dy    = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image as HTMLImageElement, FRONT_UV_RECT);
    if (backImage  && backTex.image)  drawFitted(backTex.image  as HTMLImageElement, BACK_UV_RECT);

    const composite      = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY      = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag]   = useState<THREE.Vector3 | false>(false);
  const [hovered, hover]  = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1,    j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2,    j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - (dragged as THREE.Vector3).x,
        y: vec.y - (dragged as THREE.Vector3).y,
        z: vec.z - (dragged as THREE.Vector3).z,
      });
    }

    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      // band.current.geometry is MeshLineGeometry which has setPoints()
      (band.current.geometry as any).setPoints(curve.getPoints(isMobile ? 16 : 32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType       = 'chordal';
  texture.wrapS         = THREE.RepeatWrapping;
  texture.wrapT         = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry}  material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      {/* Lanyard band (rope) */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

// Preload the GLB so it's cached before first render
useGLTF.preload(CARD_GLB);
