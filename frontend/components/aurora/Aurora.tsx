'use client';

import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
    colorStops?: [string, string, string];
    speed?: number;
    blend?: number;
    amplitude?: number;
    className?: string;
}

export default function Aurora({
    colorStops = ['#061222', '#123249', '#2D5B75'],
    speed = 0.5,
    blend = 0.5,
    amplitude = 1.0,
    className = '',
}: AuroraProps) {
    const ctnDom = useRef<HTMLDivElement>(null);
    const propsRef = useRef({ colorStops, speed, blend, amplitude });

    useEffect(() => {
        propsRef.current = { colorStops, speed, blend, amplitude };
    }, [colorStops, speed, blend, amplitude]);

    useEffect(() => {
        const ctn = ctnDom.current;
        if (!ctn) return;

        // Detect mobile for resolution / FPS downscaling
        const isMobileDevice = () =>
            window.innerWidth < 768 || 'ontouchstart' in window;

        // antialias: false = massive GPU savings (invisible diff on shader backgrounds)
        const renderer = new Renderer({
            alpha: true,
            premultipliedAlpha: true,
            antialias: false,
            // Cap DPR — lower on mobile to reduce fill-rate cost
            dpr: Math.min(window.devicePixelRatio || 1, isMobileDevice() ? 1 : 1.5),
        });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.canvas.style.backgroundColor = 'transparent';

        let program: Program;

        function resize() {
            if (!ctn) return;
            const mobile = isMobileDevice();
            // On mobile: render at half resolution (50% width/height) — huge performance win
            const scale = mobile ? 0.5 : 1;
            const width = Math.floor(ctn.offsetWidth * scale);
            const height = Math.floor(ctn.offsetHeight * scale);
            renderer.setSize(width, height);
            // Keep canvas visually filling the container via CSS
            gl.canvas.style.width = '100%';
            gl.canvas.style.height = '100%';
            if (program) {
                program.uniforms.uResolution.value = [width, height];
            }
        }
        window.addEventListener('resize', resize);

        const geometry = new Triangle(gl);
        if (geometry.attributes.uv) {
            delete geometry.attributes.uv;
        }

        const colorStopsArray = colorStops.map(hex => {
            const c = new Color(hex);
            return [c.r, c.g, c.b];
        });

        program = new Program(gl, {
            vertex: VERT,
            fragment: FRAG,
            uniforms: {
                uTime: { value: 0 },
                uAmplitude: { value: amplitude },
                uColorStops: { value: colorStopsArray },
                uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
                uBlend: { value: blend }
            }
        });

        const mesh = new Mesh(gl, { geometry, program });
        ctn.appendChild(gl.canvas);

        let stopsCache = propsRef.current.colorStops.map(hex => {
            const c = new Color(hex);
            return [c.r, c.g, c.b];
        });

        let animateId = 0;
        let isVisible = true;
        let lastTime = 0;
        const mobile = isMobileDevice();
        // Background shader: slightly lower FPS on mobile — same look, less heat
        const FPS_CAP = mobile ? 20 : 30;
        const FRAME_INTERVAL = 1000 / FPS_CAP;

        const update = (t: number) => {
            animateId = requestAnimationFrame(update);
            if (!isVisible) return;

            // Throttle to 30fps
            if (t - lastTime < FRAME_INTERVAL) return;
            lastTime = t;

            const { speed: spd, amplitude: amp, blend: bl, colorStops: stops } = propsRef.current;
            // Update stopsCache dari propsRef agar perubahan warna tetap teraplikasi tanpa re-init
            stopsCache = stops.map(hex => {
                const c = new Color(hex);
                return [c.r, c.g, c.b];
            });
            program.uniforms.uTime.value = t * 0.01 * (spd || 0.5) * 0.1;
            program.uniforms.uAmplitude.value = amp ?? 1.0;
            program.uniforms.uBlend.value = bl ?? 0.5;
            program.uniforms.uColorStops.value = stopsCache;
            renderer.render({ scene: mesh });
        };
        animateId = requestAnimationFrame(update);

        // Pause rendering when not visible to save GPU
        const observer = new IntersectionObserver(
            ([entry]) => { isVisible = entry.isIntersecting; },
            { threshold: 0 }
        );
        observer.observe(ctn);

        resize();

        return () => {
            cancelAnimationFrame(animateId);
            observer.disconnect();
            window.removeEventListener('resize', resize);
            if (ctn && gl.canvas.parentNode === ctn) {
                ctn.removeChild(gl.canvas);
            }
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, []); // colorStops dibaca dari propsRef tiap frame — tidak perlu di dependency

    return <div ref={ctnDom} className={`w-full h-full absolute inset-0 pointer-events-none ${className}`} />;
}