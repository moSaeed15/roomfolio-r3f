import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useApp } from '../store';

// Just above the mug rim (mug world pos is roughly [-0.496, 1.328, 0.375]).
const ORIGIN: [number, number, number] = [-0.496, 1.36, 0.375];

// The room is authored at roughly half scale, so the steam plane is shrunk
// down from the original demo's ~6-unit-tall column to fit a coffee mug.
const STEAM_SCALE = 0.1;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform sampler2D uPerlinTexture;

  varying vec2 vUv;

  vec2 rotate2D(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
  }

  void main() {
    vec3 newPosition = position;

    // Twist
    float twistPerlin = texture2D(
      uPerlinTexture,
      vec2(0.5, uv.y * 0.2 - uTime * 0.005)
    ).r;
    float angle = twistPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind
    vec2 windOffset = vec2(
      texture2D(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
      texture2D(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 10.0;
    newPosition.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform sampler2D uPerlinTexture;

  varying vec2 vUv;

  void main() {
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;

    float smoke = texture2D(uPerlinTexture, smokeUv).r;

    smoke = smoothstep(0.4, 1.0, smoke);

    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.4, vUv.y);

    gl_FragColor = vec4(0.75, 0.75, 0.75, smoke * uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default function CoffeeSteam() {
  const { lightsOn } = useApp();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, 16, 64);
    geo.translate(0, 0.5, 0);
    geo.scale(0.8, 3.5, 0.8);

    const perlin = new THREE.TextureLoader().load('/textures/perlin.png');
    perlin.wrapS = THREE.RepeatWrapping;
    perlin.wrapT = THREE.RepeatWrapping;

    return {
      geometry: geo,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uOpacity: new THREE.Uniform(0.7),
        uPerlinTexture: new THREE.Uniform(perlin),
      },
    };
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    const target = lightsOn ? 0.7 : 0.32;
    const cur = materialRef.current.uniforms.uOpacity.value;
    materialRef.current.uniforms.uOpacity.value += (target - cur) * 0.05;
  });

  return (
    <mesh
      position={ORIGIN}
      scale={STEAM_SCALE}
      geometry={geometry}
      renderOrder={2}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
