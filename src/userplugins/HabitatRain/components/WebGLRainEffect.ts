/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from "../utils/settingsStore";
import { forestBackground } from "./ForestBackground";
const MAX_RETRIES = 3;
let contextLostCount = 0;

let rainCanvas: HTMLCanvasElement | null = null;
let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;
let texture: WebGLTexture | null = null;
let blurredScreenTexture: WebGLTexture | null = null;
let puddleMaskTexture: WebGLTexture | null = null;
let animationFrameId: number | null = null;
let startTime: number = 0;
let isContextLost = false;
let isStaticTextureSet = false; // Track if static texture has been set
let lastVideoTime = -1; // Track video frame changes

// Performance monitoring
interface PerformanceMetrics {
    fps: number;
    frameTime: number;
    averageFps: number;
    qualityLevel: number; // 0-3 (0=lowest, 3=highest)
}

const performanceMetrics: PerformanceMetrics = {
    fps: 60,
    frameTime: 16.67,
    averageFps: 60,
    qualityLevel: 3
};

let frameCount = 0;
let fpsUpdateTime = 0;
const frameTimes: number[] = [];
let lastPerformanceCheck = 0;
const autoQualityEnabled = true;

// Cache uniform locations for performance
interface UniformLocations {
    texture: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
    intensity: WebGLUniformLocation | null;
    scale: WebGLUniformLocation | null;
    angle: WebGLUniformLocation | null;
    speed: WebGLUniformLocation | null;
    resolution: WebGLUniformLocation | null;
    rainColor: WebGLUniformLocation | null;
    // Puddle system uniforms
    puddleY: WebGLUniformLocation | null;
    puddleScaleY: WebGLUniformLocation | null;
    enablePuddles: WebGLUniformLocation | null;
    blurredScreen: WebGLUniformLocation | null;
    puddleMask: WebGLUniformLocation | null;
    // Dynamic lighting uniforms
    enableLighting: WebGLUniformLocation | null;
    numLights: WebGLUniformLocation | null;
    lightPositions: WebGLUniformLocation | null;
    lightColors: WebGLUniformLocation | null;
    lightRadii: WebGLUniformLocation | null;
    lightMap: WebGLUniformLocation | null;
}

let uniformLocations: UniformLocations | null = null;

const defaultRainColor = [0.2, 0.3, 1.0]; // Bluish rain color

// WebGL support detection and error handling
function checkWebGLSupport(): { supported: boolean; error?: string; } {
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (!gl || !(gl instanceof WebGLRenderingContext)) {
            return { supported: false, error: "WebGL is not supported by your browser" };
        }

        // Check for required extensions
        const requiredExtensions = ["OES_texture_float"];
        for (const ext of requiredExtensions) {
            if (!gl.getExtension(ext)) {
                console.warn(`WebGL extension ${ext} not available, but continuing anyway`);
            }
        }

        return { supported: true };
    } catch (e) {
        return { supported: false, error: `WebGL initialization failed: ${e}` };
    }
}

function showUserNotification(message: string, type: "error" | "warning" | "info" = "info") {
    // Create a simple notification that doesn't interfere with Discord
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "error" ? "#f04747" : type === "warning" ? "#faa61a" : "#43b581"};
        color: white;
        padding: 12px 16px;
        border-radius: 4px;
        font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        z-index: 10001;
        max-width: 300px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    `;

    notification.textContent = `HabitatRain: ${message}`;
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = "slideOut 0.3s ease-in";
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for notification animations
function injectNotificationStyles() {
    if (document.getElementById("habitat-rain-notifications")) return;

    const style = document.createElement("style");
    style.id = "habitat-rain-notifications";
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

const vertexShaderSource = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        vUv = vec2(aPosition.x * 0.5 + 0.5, 0.5 - aPosition.y * 0.5);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uIntensity;
    uniform float uScale;
    uniform float uAngle;
    uniform float uSpeed;
    uniform vec2 uResolution;
    uniform vec3 uRainColor;

    // Puddle system uniforms
    uniform float uPuddleY;
    uniform float uPuddleScaleY;
    uniform bool uEnablePuddles;
    uniform sampler2D uBlurredScreen;
    uniform sampler2D uPuddleMask;

    // Dynamic lighting system (from original shader)
    uniform bool uEnableLighting;
    uniform int uNumLights;
    uniform vec2 uLightPositions[8];
    uniform vec3 uLightColors[8];
    uniform float uLightRadii[8];
    uniform sampler2D uLightMap;

    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+10.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0);
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    float rand(vec2 a) {
        return fract(sin(dot(mod(a, vec2(1000.0)), vec2(12.9898, 78.233))) * 43758.5453);
    }

    float ease(float t) {
        return t * t * (3.0 - 2.0 * t);
    }

    // Puddle ripple functions from original shader
    float rippleHeight(vec2 p, vec2 pos, float age, float size, float modSize, float thickness) {
        float strength = 1.0 - exp(-(1.0 - age) * 1.0);
        float h = max(0.0, 1.0 - abs(length(mod(p - pos + modSize * 0.5, vec2(modSize)) - modSize * 0.5) - size * age) / thickness);
        h = h * h * (3.0 - 2.0 * h); // smoothstep
        return h * strength;
    }

    vec2 puddleDisplace(vec2 p, float intensity) {
        if (!uEnablePuddles) return vec2(0.0);

        vec2 res = vec2(0.0);
        const int numRipples = 15; // Reduced from 30 for performance
        const float rippleLife = 0.8;
        const float rippleSize = 100.0;
        const float rippleMod = rippleSize * 2.0;

        for (int i = 0; i < numRipples; i++) {
            float shift = float(i) / float(numRipples);
            float rippleNumber = uTime / rippleLife + shift;
            float rippleId = floor(rippleNumber);
            rippleId = rand(vec2(rippleId, float(i)));
            float x = rand(vec2(rippleId, rippleId + 1.0)) * rippleMod;
            float y = rand(vec2(rippleId + 2.0, rippleId + 3.0)) * rippleMod;
            vec2 pos = vec2(x, y);
            float age = fract(rippleNumber);
            float thickness = 4.0;
            float eps = 1.0;
            vec2 pScale = vec2(1.0, 1.0 / uPuddleScaleY);
            float hc = rippleHeight(p * pScale, pos, age, rippleSize, rippleMod, thickness);
            float hx = rippleHeight((p + vec2(eps, 0.0)) * pScale, pos, age, rippleSize, rippleMod, thickness);
            float hy = rippleHeight((p + vec2(0.0, eps)) * pScale, pos, age, rippleSize, rippleMod, thickness);
            vec2 normal = (vec2(hx, hy) - hc) / eps;
            res += normal * 20.0 * intensity;
        }
        return res;
    }

    // Dynamic lighting function from original shader
    vec3 lightUp(vec2 p) {
        if (!uEnableLighting) return vec3(0.0);

        vec3 res = vec3(0.0);
        for (int i = 0; i < 8; i++) {
            if (i >= uNumLights) break;

            vec2 lp = uLightPositions[i];
            vec3 lc = uLightColors[i];
            float lr = uLightRadii[i];
            float w = max(0.0, 1.0 - length(lp - p) / lr);
            res += ease(w) * lc;
        }
        return res;
    }

    float rainDist(vec2 p, float scale, float intensity) {
        float angleRad = radians(uAngle);
        mat2 rotation = mat2(cos(angleRad), -sin(angleRad), sin(angleRad), cos(angleRad));
        p = rotation * p;

        p *= 0.1;
        p.x += p.y * 0.1;
        p.y -= uTime * 500.0 * uSpeed / scale;
        p.y *= 0.03;
        float ix = floor(p.x);
        p.y += mod(ix, 2.0) * 0.5 + (rand(vec2(ix)) - 0.5) * 0.3;
        float iy = floor(p.y);
        vec2 index = vec2(ix, iy);
        p -= index;
        p.x += (rand(index.yx) * 2.0 - 1.0) * 0.35;
        vec2 a = abs(p - 0.5);
        float res = max(a.x * 0.8, a.y * 0.5) - 0.1;
        bool empty = rand(index) < mix(1.0, 0.1, intensity);
        return empty ? 1.0 : res;
    }

    void main() {
        vec2 wpos = vUv * uResolution;
        float intensity = uIntensity;

        vec3 add = vec3(0.0);
        float rainSum = 0.0;

        const int numLayers = 4;
        float scales[4];
        scales[0] = 1.0;
        scales[1] = 1.8;
        scales[2] = 2.6;  // Fixed: Match original shader values
        scales[3] = 4.8;  // Fixed: Match original shader values

        for (int i = 0; i < numLayers; i++) {
            float scale = scales[i];
            float r = rainDist(wpos * scale / uScale + 500.0 * float(i), scale, intensity);
            if (r < 0.0) {
                float v = (1.0 - exp(r * 5.0)) / scale * 2.0;
                // For background layers (higher scale), clamp v to a minimum for visibility
                if (i >= 2) {
                    v = max(v, 0.08); // Only for farthest two layers
                }
                wpos.x += v * 10.0 * uScale;
                wpos.y -= v * 2.0 * uScale;
                add += vec3(0.1, 0.15, 0.2) * v; // original color
                rainSum += (1.0 - rainSum) * 0.75; // original blend
            }
        }

        vec2 sampleUV = wpos / uResolution;
        vec3 color = texture2D(uTexture, sampleUV).rgb;

        // Puddle reflection system (from original shader)
        if (uEnablePuddles) {
            float puddleMask = texture2D(uPuddleMask, vUv).r;
            if (puddleMask > 0.5) {
                // Calculate reflection coordinates
                vec2 reflectionPos = vec2(wpos.x, uPuddleY - (wpos.y - uPuddleY) / uPuddleScaleY);
                reflectionPos += puddleDisplace(wpos / 100.0, intensity) * 100.0;

                vec2 reflectionUV = reflectionPos / uResolution;
                reflectionUV.y = 1.0 - reflectionUV.y; // Flip Y for reflection

                // Sample blurred screen for reflection
                vec3 reflection = texture2D(uBlurredScreen, reflectionUV).rgb * 0.3 + 0.3;

                // Blend reflection with base color
                float reflectionStrength = puddleMask * 0.7;
                color = mix(color, reflection, reflectionStrength);
            }
        }

        color += add;
        color = mix(color, uRainColor, 0.1 * rainSum); // original blend

        gl_FragColor = vec4(color, 1.0);
    }
`;

export function setup() {
    cleanup();
    if (!isActive()) return;

    // Inject notification styles
    injectNotificationStyles();

    // Check WebGL support before proceeding
    const webglCheck = checkWebGLSupport();
    if (!webglCheck.supported) {
        console.error("WebGL not supported:", webglCheck.error);
        showUserNotification(webglCheck.error || "WebGL not supported", "error");
        return;
    }

    rainCanvas = document.createElement("canvas");
    rainCanvas.id = `habitat-rain-canvas-${Date.now()}`;
    rainCanvas.style.position = "fixed";
    rainCanvas.style.top = "0px";
    rainCanvas.style.left = "0";
    rainCanvas.style.width = "100%";
    rainCanvas.style.height = "100%";
    rainCanvas.style.zIndex = "-1";
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;

    document.body.appendChild(rainCanvas);

    try {
        gl = rainCanvas.getContext("webgl", {
            preserveDrawingBuffer: false,
            antialias: false,
            failIfMajorPerformanceCaveat: false
        });

        if (!gl) {
            console.error("WebGL context creation failed");
            showUserNotification("Failed to create WebGL context", "error");
            return;
        }

        rainCanvas.addEventListener("webglcontextlost", handleContextLost, false);
        rainCanvas.addEventListener("webglcontextrestored", handleContextRestored, false);

        const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) {
            console.error("Failed to compile shaders");
            showUserNotification("Shader compilation failed. Your graphics drivers may need updating.", "error");
            return;
        }

        program = gl.createProgram();
        if (!program) {
            console.error("Failed to create WebGL program");
            showUserNotification("Failed to create WebGL program", "error");
            return;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const linkError = gl.getProgramInfoLog(program);
            console.error("Shader program link error:", linkError);
            showUserNotification("Shader program linking failed", "error");
            return;
        }

        gl.useProgram(program);

        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Set initial texture based on background type
        if (forestBackground) {
            if (forestBackground instanceof HTMLImageElement) {
                // Static image - set texture immediately
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, forestBackground);
                isStaticTextureSet = true;
            } else {
                // Video - use placeholder until frames are available
                const placeholder = new Uint8Array([255, 0, 255, 255]);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, placeholder);
                isStaticTextureSet = false;
            }
        } else {
            // No background - use placeholder
            const placeholder = new Uint8Array([255, 0, 255, 255]);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, placeholder);
            isStaticTextureSet = false;
        }

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);

        const positionAttribute = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(positionAttribute);
        gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

        // Cache uniform locations for performance optimization
        uniformLocations = {
            texture: gl.getUniformLocation(program, "uTexture"),
            time: gl.getUniformLocation(program, "uTime"),
            intensity: gl.getUniformLocation(program, "uIntensity"),
            scale: gl.getUniformLocation(program, "uScale"),
            angle: gl.getUniformLocation(program, "uAngle"),
            speed: gl.getUniformLocation(program, "uSpeed"),
            resolution: gl.getUniformLocation(program, "uResolution"),
            rainColor: gl.getUniformLocation(program, "uRainColor"),
            // Puddle system uniforms
            puddleY: gl.getUniformLocation(program, "uPuddleY"),
            puddleScaleY: gl.getUniformLocation(program, "uPuddleScaleY"),
            enablePuddles: gl.getUniformLocation(program, "uEnablePuddles"),
            blurredScreen: gl.getUniformLocation(program, "uBlurredScreen"),
            puddleMask: gl.getUniformLocation(program, "uPuddleMask"),
            // Dynamic lighting uniforms
            enableLighting: gl.getUniformLocation(program, "uEnableLighting"),
            numLights: gl.getUniformLocation(program, "uNumLights"),
            lightPositions: gl.getUniformLocation(program, "uLightPositions"),
            lightColors: gl.getUniformLocation(program, "uLightColors"),
            lightRadii: gl.getUniformLocation(program, "uLightRadii"),
            lightMap: gl.getUniformLocation(program, "uLightMap")
        };

        // Set initial uniform values
        if (uniformLocations.texture) gl.uniform1i(uniformLocations.texture, 0);
        if (uniformLocations.intensity) gl.uniform1f(uniformLocations.intensity, settings.store.rainIntensity);
        if (uniformLocations.scale) gl.uniform1f(uniformLocations.scale, Number(settings.store.rainScale));
        if (uniformLocations.angle) gl.uniform1f(uniformLocations.angle, Number(settings.store.rainAngle));
        if (uniformLocations.speed) gl.uniform1f(uniformLocations.speed, Number(settings.store.rainSpeed));
        if (uniformLocations.resolution) gl.uniform2f(uniformLocations.resolution, rainCanvas.width, rainCanvas.height);
        if (uniformLocations.rainColor) gl.uniform3fv(uniformLocations.rainColor, defaultRainColor);

        // Initialize puddle system
        const enablePuddles = settings.store.enablePuddles || false;
        if (uniformLocations.enablePuddles) gl.uniform1i(uniformLocations.enablePuddles, enablePuddles ? 1 : 0);
        if (uniformLocations.puddleY) gl.uniform1f(uniformLocations.puddleY, rainCanvas.height * 0.8);
        if (uniformLocations.puddleScaleY) gl.uniform1f(uniformLocations.puddleScaleY, 1.0);

        // Create puddle textures if enabled
        if (enablePuddles) {
            // Create blurred screen texture
            blurredScreenTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, blurredScreenTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Create puddle mask texture
            puddleMaskTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, puddleMaskTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Upload puddle mask
            const maskCanvas = createPuddleMask();
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvas);

            // Set texture units
            if (uniformLocations.blurredScreen) gl.uniform1i(uniformLocations.blurredScreen, 1);
            if (uniformLocations.puddleMask) gl.uniform1i(uniformLocations.puddleMask, 2);

            // Reset to texture 0
            gl.activeTexture(gl.TEXTURE0);
        }

        // Initialize dynamic lighting system
        const enableLighting = settings.store.enableLighting || false;
        if (uniformLocations.enableLighting) gl.uniform1i(uniformLocations.enableLighting, enableLighting ? 1 : 0);

        if (enableLighting) {
            // Initialize dynamic lights
            dynamicLights.length = 0; // Clear existing lights
            dynamicLights.push(...createDynamicLights());
            if (uniformLocations.numLights) gl.uniform1i(uniformLocations.numLights, dynamicLights.length);

            // Set light data
            const positions: number[] = [];
            const colors: number[] = [];
            const radii: number[] = [];

            dynamicLights.forEach((light: Light) => {
                positions.push(light.position[0], light.position[1]);
                colors.push(light.color[0], light.color[1], light.color[2]);
                radii.push(light.radius);
            });

            if (uniformLocations.lightPositions) gl.uniform2fv(uniformLocations.lightPositions, positions);
            if (uniformLocations.lightColors) gl.uniform3fv(uniformLocations.lightColors, colors);
            if (uniformLocations.lightRadii) gl.uniform1fv(uniformLocations.lightRadii, radii);
        }

        startTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
        contextLostCount = 0;
    } catch (e) {
        console.error("WebGL initialization failed:", e);
        showUserNotification(`WebGL initialization failed: ${e}`, "error");
        contextLostCount++;
        if (contextLostCount < MAX_RETRIES) {
            showUserNotification(`Retrying WebGL initialization (${contextLostCount}/${MAX_RETRIES})`, "warning");
            setTimeout(setup, 1000);
        } else {
            showUserNotification("WebGL initialization failed after multiple attempts. Rain effects disabled.", "error");
        }
    }
}

export function cleanup() {
    // Cancel animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Clean up WebGL resources
    if (gl && program) {
        gl.deleteProgram(program);
    }
    if (gl && texture) {
        gl.deleteTexture(texture);
    }

    // Remove canvas from DOM
    if (rainCanvas?.parentNode) {
        rainCanvas.parentNode.removeChild(rainCanvas);
    }

    // Reset all variables to initial state
    rainCanvas = null;
    program = null;
    texture = null;
    gl = null;
    uniformLocations = null;
    isStaticTextureSet = false;
    lastVideoTime = -1;
    isContextLost = false;
    contextLostCount = 0;
}

export function update() {
    // Uniforms are updated in animation loop
}

export function handleResize() {
    if (rainCanvas) {
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;

        // Use cached uniform location for better performance
        if (gl && uniformLocations?.resolution) {
            gl.uniform2f(uniformLocations.resolution, rainCanvas.width, rainCanvas.height);
        }
    }
}

function animate() {
    if (isContextLost) return;
    if (!gl || !program || !rainCanvas) return;

    try {
        // Update texture based on background type - optimized for performance
        if (forestBackground) {
            if (forestBackground instanceof HTMLVideoElement) {
                // Video - only update texture when frame actually changes
                if (forestBackground.readyState >= HTMLMediaElement.HAVE_METADATA &&
                    forestBackground.currentTime !== lastVideoTime) {
                    lastVideoTime = forestBackground.currentTime;
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, forestBackground);
                }
            } else if (!isStaticTextureSet) {
                // Static image - only set once
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, forestBackground);
                isStaticTextureSet = true;
            }
        }

        // Update uniforms using cached locations for better performance
        if (uniformLocations) {
            if (uniformLocations.time) gl.uniform1f(uniformLocations.time, (performance.now() - startTime) / 1000);
            if (uniformLocations.intensity) gl.uniform1f(uniformLocations.intensity, settings.store.rainIntensity);
            if (uniformLocations.scale) gl.uniform1f(uniformLocations.scale, Number(settings.store.rainScale));
            if (uniformLocations.angle) gl.uniform1f(uniformLocations.angle, Number(settings.store.rainAngle));
            if (uniformLocations.speed) gl.uniform1f(uniformLocations.speed, Number(settings.store.rainSpeed));
        }

        // Render
        gl.viewport(0, 0, rainCanvas.width, rainCanvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Update performance metrics
        const currentTime = performance.now();
        updatePerformanceMetrics(currentTime);

    } catch (e) {
        console.error("Error in animation loop:", e);
        return;
    }
    animationFrameId = requestAnimationFrame(animate);
}

function handleContextLost(event: Event) {
    event.preventDefault();
    isContextLost = true;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    setTimeout(() => isActive() && setup(), 2000 + contextLostCount * 1000);
}

function handleContextRestored() {
    isContextLost = false;
    contextLostCount = 0;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Shader compile error: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function isActive() {
    return settings.store.showForestBackground;
}

// Screen capture and blur for puddle reflections
function captureAndBlurScreen(): HTMLCanvasElement | null {
    try {
        // Create a canvas to capture the current screen
        const captureCanvas = document.createElement("canvas");
        captureCanvas.width = window.innerWidth;
        captureCanvas.height = window.innerHeight;
        const ctx = captureCanvas.getContext("2d");

        if (!ctx) return null;

        // Capture the current DOM state (simplified approach)
        // In a real implementation, you'd want to use html2canvas or similar
        const appMount = document.getElementById("app-mount");
        if (appMount) {
            // Create a simple gradient as placeholder for screen capture
            // This would be replaced with actual screen capture in production
            const gradient = ctx.createLinearGradient(0, 0, 0, captureCanvas.height);
            gradient.addColorStop(0, "#2f3136");
            gradient.addColorStop(1, "#36393f");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
        }

        // Apply blur effect
        ctx.filter = "blur(8px)";
        ctx.drawImage(captureCanvas, 0, 0);

        return captureCanvas;
    } catch (e) {
        console.warn("Failed to capture screen for puddle reflections:", e);
        return null;
    }
}

// Create a simple puddle mask texture
function createPuddleMask(): HTMLCanvasElement {
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = 512;
    maskCanvas.height = 512;
    const ctx = maskCanvas.getContext("2d")!;

    // Create a simple puddle pattern
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 512, 512);

    // Add some puddle areas (white areas will be reflective)
    ctx.fillStyle = "#ffffff";

    // Create some oval puddle shapes
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const width = 50 + Math.random() * 100;
        const height = 20 + Math.random() * 40;

        ctx.beginPath();
        ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    return maskCanvas;
}

// Dynamic lighting system
interface Light {
    position: [number, number];
    color: [number, number, number];
    radius: number;
    velocity: [number, number];
    phase: number;
}

function createDynamicLights(): Light[] {
    const lights: Light[] = [];
    const numLights = 4; // Start with fewer lights for performance

    for (let i = 0; i < numLights; i++) {
        lights.push({
            position: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            ],
            color: [
                0.3 + Math.random() * 0.7, // R
                0.4 + Math.random() * 0.6, // G
                0.8 + Math.random() * 0.2 // B (more blue for rain atmosphere)
            ],
            radius: 100 + Math.random() * 200,
            velocity: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            ],
            phase: Math.random() * Math.PI * 2
        });
    }

    return lights;
}

const dynamicLights: Light[] = [];
let lightUpdateTime = 0;

function updateDynamicLights(deltaTime: number): void {
    lightUpdateTime += deltaTime;

    dynamicLights.forEach((light, index) => {
        // Update position with velocity
        light.position[0] += light.velocity[0] * deltaTime;
        light.position[1] += light.velocity[1] * deltaTime;

        // Bounce off screen edges
        if (light.position[0] < 0 || light.position[0] > window.innerWidth) {
            light.velocity[0] *= -1;
            light.position[0] = Math.max(0, Math.min(window.innerWidth, light.position[0]));
        }
        if (light.position[1] < 0 || light.position[1] > window.innerHeight) {
            light.velocity[1] *= -1;
            light.position[1] = Math.max(0, Math.min(window.innerHeight, light.position[1]));
        }

        // Animate intensity
        light.phase += deltaTime * 2;
        const intensity = 0.5 + 0.5 * Math.sin(light.phase);
        light.color[0] = (0.3 + Math.random() * 0.7) * intensity;
        light.color[1] = (0.4 + Math.random() * 0.6) * intensity;
        light.color[2] = (0.8 + Math.random() * 0.2) * intensity;
    });
}

// Performance monitoring functions
function updatePerformanceMetrics(currentTime: number): void {
    frameCount++;
    const deltaTime = currentTime - fpsUpdateTime;

    if (deltaTime >= 1000) { // Update every second
        performanceMetrics.fps = (frameCount * 1000) / deltaTime;
        performanceMetrics.averageFps = frameTimes.length > 0
            ? frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
            : performanceMetrics.fps;

        frameCount = 0;
        fpsUpdateTime = currentTime;

        // Auto-adjust quality based on performance
        if (autoQualityEnabled && currentTime - lastPerformanceCheck > 5000) {
            adjustQualityBasedOnPerformance();
            lastPerformanceCheck = currentTime;
        }
    }

    // Track frame times for averaging
    frameTimes.push(performanceMetrics.fps);
    if (frameTimes.length > 60) frameTimes.shift(); // Keep last 60 samples
}

function adjustQualityBasedOnPerformance(): void {
    const targetFps = 30; // Minimum acceptable FPS
    const currentFps = performanceMetrics.averageFps;

    if (currentFps < targetFps && performanceMetrics.qualityLevel > 0) {
        // Reduce quality
        performanceMetrics.qualityLevel--;
        applyQualitySettings(performanceMetrics.qualityLevel);
        showUserNotification(`Performance: Quality reduced to level ${performanceMetrics.qualityLevel}`, "warning");
    } else if (currentFps > targetFps + 10 && performanceMetrics.qualityLevel < 3) {
        // Increase quality
        performanceMetrics.qualityLevel++;
        applyQualitySettings(performanceMetrics.qualityLevel);
        showUserNotification(`Performance: Quality increased to level ${performanceMetrics.qualityLevel}`, "info");
    }
}

function applyQualitySettings(qualityLevel: number): void {
    // Adjust settings based on quality level
    switch (qualityLevel) {
        case 0: // Lowest quality
            settings.store.rainIntensity = Math.min(settings.store.rainIntensity, 0.3);
            settings.store.enableMist = false;
            settings.store.enablePuddles = false;
            settings.store.enableLighting = false;
            break;
        case 1: // Low quality
            settings.store.rainIntensity = Math.min(settings.store.rainIntensity, 0.5);
            settings.store.enableMist = false;
            settings.store.enablePuddles = false;
            settings.store.enableLighting = false;
            break;
        case 2: // Medium quality
            settings.store.enableMist = true;
            settings.store.enablePuddles = false;
            settings.store.enableLighting = false;
            break;
        case 3: // High quality
            settings.store.enableMist = true;
            settings.store.enablePuddles = true;
            settings.store.enableLighting = true;
            break;
    }
}

// Export performance metrics for debugging
export function getPerformanceMetrics(): PerformanceMetrics {
    return { ...performanceMetrics };
}

export function reset() {
    cleanup();
    if (isActive()) setup();
}
