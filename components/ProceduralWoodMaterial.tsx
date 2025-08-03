
import { shaderMaterial } from '@react-three/drei';
import { extend, ShaderMaterialProps } from '@react-three/fiber';
import * as THREE from 'three';

const ProceduralWoodMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uColor: new THREE.Color(1.0, 1.0, 1.0),
    uEmissive: new THREE.Color(0.0, 0.0, 0.0),
    uEmissiveIntensity: 1.0,
  },
  // Vertex Shader
  /*glsl*/`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  /*glsl*/`
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uEmissive;
    uniform float uEmissiveIntensity;
    varying vec2 vUv;

    // 2D Random
    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 2D Noise
    float noise (vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 scaledUv = vUv * vec2(1.0, 6.0); // Stretch coordinates to make grain
      float n = noise(scaledUv * 5.0);
      
      // Create rings
      float rings = fract(n * 10.0);
      rings = pow(rings, 0.5); // Soften the edges

      // Define wood colors - updated to lighter shades
      vec3 lightWood = vec3(0.9, 0.7, 0.4);
      vec3 darkWood = vec3(0.7, 0.5, 0.3);

      // Mix colors based on rings
      vec3 woodColor = mix(lightWood, darkWood, rings);

      // Add subtle grain
      float grain = noise(scaledUv * 20.0) * 0.05;
      woodColor += grain;
      
      vec3 finalColor = woodColor * uColor;
      vec3 emissiveColor = uEmissive * uEmissiveIntensity;

      gl_FragColor = vec4(finalColor + emissiveColor, 1.0);
    }
  `
);

extend({ ProceduralWoodMaterial });

type ProceduralWoodMaterialProps = ShaderMaterialProps & {
  uTime?: number;
  uColor?: THREE.Color | string | number;
  uEmissive?: THREE.Color | string | number;
  uEmissiveIntensity?: number;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      proceduralWoodMaterial: ProceduralWoodMaterialProps;
    }
  }
}
