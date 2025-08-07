/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from "../utils/settingsStore";

interface SteamLayer {
    container: HTMLDivElement;
    elementA: HTMLDivElement;
    elementB: HTMLDivElement;
    position: number;
    speed: number;
    scale: number;
    alpha: number;
    wrapWidth: number;
    layerType: "background" | "particles" | "wisps";
    turbulence: number;
    temperature: number;
    density: number;
}

interface SteamParticle {
    element: HTMLDivElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    opacity: number;
    temperature: number;
}

interface SteamSource {
    x: number;
    y: number;
    intensity: number;
    type: "pipe" | "vent" | "gear" | "engine";
    direction: number; // angle in degrees
    pressure: number;
    active: boolean;
}

const steamLayers: SteamLayer[] = [];
const steamParticles: SteamParticle[] = [];
const steamSources: SteamSource[] = [];
let animationFrameId: number | null = null;
let lastFrameTime = 0;
let userActivity = 0;
let lastMouseMove = 0;

// Enhanced steam layer configurations
const STEAM_CONFIGS = [
    {
        id: "steam0",
        image: "STEAM_PARTICLE",
        zIndex: 50,
        speed: 15,
        scale: 1.0,
        alpha: 0.4,
        wrapWidth: 2000,
        layerType: "background" as const,
        turbulence: 0.2,
        temperature: 80,
        density: 0.6
    },
    {
        id: "steam1",
        image: "STEAM_PARTICLE",
        zIndex: 51,
        speed: 25,
        scale: 1.2,
        alpha: 0.3,
        wrapWidth: 1800,
        layerType: "particles" as const,
        turbulence: 0.4,
        temperature: 90,
        density: 0.4
    },
    {
        id: "steam2",
        image: "STEAM_PARTICLE",
        zIndex: 52,
        speed: 35,
        scale: 1.5,
        alpha: 0.2,
        wrapWidth: 2200,
        layerType: "wisps" as const,
        turbulence: 0.6,
        temperature: 100,
        density: 0.2
    }
];

export function start() {
    if (steamLayers.length > 0) return;

    // Create enhanced steam layers
    STEAM_CONFIGS.forEach(config => {
        const layer = createEnhancedLayer(config);
        steamLayers.push(layer);
    });

    // Initialize steam sources
    initializeSteamSources();

    // Add user activity tracking
    document.addEventListener("mousemove", trackUserActivity);
    document.addEventListener("keydown", trackUserActivity);
    document.addEventListener("click", trackUserActivity);

    // Start animation loop
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(animateEnhancedSteam);
}

export function stop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Clean up steam layers
    steamLayers.forEach(layer => {
        if (layer.container.parentNode) {
            layer.container.parentNode.removeChild(layer.container);
        }
    });
    steamLayers.length = 0;

    // Clean up steam particles
    steamParticles.forEach(particle => {
        if (particle.element.parentNode) {
            particle.element.parentNode.removeChild(particle.element);
        }
    });
    steamParticles.length = 0;

    // Clear steam sources
    steamSources.length = 0;

    // Remove event listeners
    document.removeEventListener("mousemove", trackUserActivity);
    document.removeEventListener("keydown", trackUserActivity);
    document.removeEventListener("click", trackUserActivity);

    // Reset activity tracking
    userActivity = 0;
    lastMouseMove = 0;
}

export function update() {
    steamLayers.forEach(layer => {
        const intensity = settings.store.steamIntensity / 100;
        layer.elementA.style.opacity = `${layer.alpha * intensity}`;
        layer.elementB.style.opacity = `${layer.alpha * intensity}`;
    });
}

function createEnhancedLayer(config: typeof STEAM_CONFIGS[0]) {
    const container = document.createElement("div");
    container.id = `spectral-steam-${config.id}`;
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: ${config.wrapWidth * 2}px;
        height: 100%;
        z-index: ${config.zIndex};
        pointer-events: none;
        mix-blend-mode: ${config.layerType === "background" ? "multiply" : "lighten"};
        overflow: hidden;
        will-change: transform;
        filter: blur(${config.layerType === "wisps" ? "12px" : "8px"});
    `;

    const elementA = document.createElement("div");
    elementA.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: ${config.wrapWidth}px;
        height: 100%;
        background: ${createSteamGradient(config.temperature, config.density)};
        background-size: auto 100%;
        background-repeat: repeat-x;
        opacity: ${config.alpha};
        transform: scale(${config.scale});
        animation: steamTurbulence ${20 / config.turbulence}s ease-in-out infinite;
    `;

    const elementB = elementA.cloneNode(true) as HTMLDivElement;
    elementB.style.left = `${config.wrapWidth}px`;
    elementB.style.animationDelay = `${config.turbulence * 5}s`;

    container.appendChild(elementA);
    container.appendChild(elementB);
    document.body.appendChild(container);

    return {
        container,
        elementA,
        elementB,
        position: 0,
        speed: config.speed,
        scale: config.scale,
        alpha: config.alpha,
        wrapWidth: config.wrapWidth,
        layerType: config.layerType,
        turbulence: config.turbulence,
        temperature: config.temperature,
        density: config.density
    };
}

function createSteamGradient(temperature: number, density: number): string {
    const opacity = density * 0.3;
    const warmth = temperature / 100;

    return `
        radial-gradient(ellipse at 20% 100%, rgba(255,255,255,${opacity}) 0%, transparent 60%),
        radial-gradient(ellipse at 50% 100%, rgba(245,245,245,${opacity * 0.8}) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(255,255,255,${opacity * 0.6}) 0%, transparent 70%),
        linear-gradient(0deg, rgba(255,${255 - warmth * 50},${255 - warmth * 100},${opacity * 0.4}) 0%, transparent 40%)
    `;
}

function initializeSteamSources() {
    // Create steam sources at strategic locations
    steamSources.push(
        { x: 50, y: window.innerHeight - 100, intensity: 0.8, type: "pipe", direction: 45, pressure: 0.7, active: true },
        { x: window.innerWidth - 100, y: 80, intensity: 0.6, type: "vent", direction: 135, pressure: 0.5, active: true },
        { x: window.innerWidth / 2, y: window.innerHeight / 2, intensity: 1.0, type: "engine", direction: 90, pressure: 0.9, active: true }
    );
}

function trackUserActivity() {
    const now = performance.now();
    lastMouseMove = now;
    userActivity = Math.min(1.0, userActivity + 0.1);

    // Increase steam intensity based on activity
    steamSources.forEach(source => {
        if (source.type === "engine") {
            source.intensity = 0.5 + userActivity * 0.5;
            source.pressure = 0.6 + userActivity * 0.4;
        }
    });
}

function animateEnhancedSteam() {
    const now = performance.now();
    const deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    const intensity = settings.store.steamIntensity / 100;

    // Decay user activity over time
    if (now - lastMouseMove > 1000) {
        userActivity = Math.max(0, userActivity - deltaTime * 0.5);
    }

    steamLayers.forEach(layer => {
        // Enhanced movement with turbulence
        const turbulenceOffset = Math.sin(now * 0.001 * layer.turbulence) * 10;
        const activityMultiplier = 1 + userActivity * 0.5;

        layer.position += layer.speed * deltaTime * intensity * activityMultiplier;

        if (layer.position > layer.wrapWidth) {
            layer.position -= layer.wrapWidth;
        }

        // Apply enhanced transforms with turbulence
        const scaleVariation = 1 + Math.sin(now * 0.002 * layer.turbulence) * 0.1;
        const finalScale = layer.scale * scaleVariation;

        layer.elementA.style.transform = `scale(${finalScale}) translateX(${-layer.position + turbulenceOffset}px) translateY(${Math.sin(now * 0.001) * 5}px)`;
        layer.elementB.style.transform = `scale(${finalScale}) translateX(${-layer.position + layer.wrapWidth + turbulenceOffset}px) translateY(${Math.cos(now * 0.001) * 5}px)`;

        // Dynamic opacity based on activity and temperature
        const dynamicOpacity = layer.alpha * intensity * (0.7 + userActivity * 0.3) * (layer.temperature / 100);
        layer.elementA.style.opacity = `${dynamicOpacity}`;
        layer.elementB.style.opacity = `${dynamicOpacity}`;
    });

    // Generate steam particles from sources
    steamSources.forEach(source => {
        if (source.active && Math.random() < source.intensity * intensity * 0.1) {
            createSteamParticle(source);
        }
    });

    // Update existing steam particles
    updateSteamParticles(deltaTime);

    animationFrameId = requestAnimationFrame(animateEnhancedSteam);
}

function createSteamParticle(source: SteamSource) {
    const particle = document.createElement("div");
    const size = 10 + Math.random() * 20;
    const life = 3 + Math.random() * 4;

    particle.style.cssText = `
        position: fixed;
        left: ${source.x}px;
        top: ${source.y}px;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        will-change: transform, opacity;
    `;

    document.body.appendChild(particle);

    const steamParticle: SteamParticle = {
        element: particle,
        x: source.x,
        y: source.y,
        vx: Math.cos(source.direction * Math.PI / 180) * source.pressure * 50,
        vy: Math.sin(source.direction * Math.PI / 180) * source.pressure * 50,
        life: life,
        maxLife: life,
        size: size,
        opacity: 0.8,
        temperature: 80 + Math.random() * 20
    };

    steamParticles.push(steamParticle);
}

function updateSteamParticles(deltaTime: number) {
    for (let i = steamParticles.length - 1; i >= 0; i--) {
        const particle = steamParticles[i];

        // Update physics
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        particle.vy -= 30 * deltaTime; // Gravity effect (steam rises)
        particle.vx *= 0.98; // Air resistance

        // Update life
        particle.life -= deltaTime;
        particle.opacity = (particle.life / particle.maxLife) * 0.8;

        // Update visual
        particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${1 + (1 - particle.life / particle.maxLife)})`;
        particle.element.style.opacity = `${particle.opacity}`;

        // Remove dead particles
        if (particle.life <= 0) {
            if (particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
            steamParticles.splice(i, 1);
        }
    }
}
