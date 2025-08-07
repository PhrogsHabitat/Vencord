/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ASSETS } from "../utils/Constants";
import { distanceEaseFactor, lerp } from "../utils/helpers";

interface Gear {
    element: HTMLDivElement;
    size: number;
    baseSpeed: number;
    layer: number;
    rotation: number;
    x: number;
    y: number;
    currentSpeed: number;
    targetSpeed: number;
    gearType: "small" | "medium" | "large" | "massive";
    material: "brass" | "copper" | "steel" | "bronze";
    connectedGears: Gear[];
    teeth: number;
    isClockwise: boolean;
    glowIntensity: number;
    steamEmission: boolean;
}

const gears: Gear[] = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let animationFrameId: number | null = null;
let lastFrameTime = 0;

export function start() {
    if (gears.length > 0) return;

    // Create enhanced gear system with interconnected gears
    createEnhancedGear(150, 0.2, 300, 20, 20, "large", "brass", true); // Top-left master gear
    createEnhancedGear(100, -0.3, 400, 180, 80, "medium", "copper", false); // Connected to master
    createEnhancedGear(120, 0.25, 500, window.innerWidth - 120, 40, "large", "steel", true); // Top-right
    createEnhancedGear(80, -0.4, 300, window.innerWidth - 200, 150, "small", "bronze", false); // Connected to top-right
    createEnhancedGear(200, 0.15, 200, window.innerWidth / 2, window.innerHeight / 2, "massive", "brass", true); // Center massive gear
    createEnhancedGear(60, -0.5, 600, window.innerWidth - 80, window.innerHeight - 80, "small", "copper", false); // Bottom-right

    // Connect gears for realistic mechanical interaction
    connectGears();

    // Add mouse move listener
    document.addEventListener("mousemove", handleMouseMove);

    // Start animation loop
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(animateGears);
}

function createEnhancedGear(
    size: number,
    speed: number,
    zIndex: number,
    x: number,
    y: number,
    gearType: "small" | "medium" | "large" | "massive",
    material: "brass" | "copper" | "steel" | "bronze",
    isClockwise: boolean
) {
    const gear = document.createElement("div");

    // Determine gear asset based on size
    let gearAsset = ASSETS.GEAR_MEDIUM;
    if (size <= 60) gearAsset = ASSETS.GEAR_SMALL;
    else if (size >= 150) gearAsset = ASSETS.GEAR_LARGE;

    // Calculate teeth based on size (for gear ratio calculations)
    const teeth = Math.floor(size / 8);

    // Material-based styling
    const materialColors = {
        brass: "#B88C4F",
        copper: "#C55A11",
        steel: "#A1A1A1",
        bronze: "#CD7F32"
    };

    gear.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: url('${gearAsset}') center/contain no-repeat;
        z-index: ${zIndex};
        pointer-events: none;
        transform: translate(${x}px, ${y}px);
        will-change: transform;
        filter:
            hue-rotate(${material === "copper" ? "20deg" : material === "steel" ? "180deg" : "0deg"})
            drop-shadow(0 0 10px ${materialColors[material]}40)
            brightness(${material === "brass" ? "1.1" : "1.0"});
        transition: filter 0.3s ease;
    `;

    // Add glow effect for special gears
    if (gearType === "massive" || material === "brass") {
        gear.style.filter += " drop-shadow(0 0 20px #B88C4F80)";
    }

    document.body.appendChild(gear);

    const newGear: Gear = {
        element: gear,
        size,
        baseSpeed: speed,
        layer: zIndex,
        rotation: 0,
        x,
        y,
        currentSpeed: speed,
        targetSpeed: speed,
        gearType,
        material,
        connectedGears: [],
        teeth,
        isClockwise,
        glowIntensity: 0,
        steamEmission: gearType === "massive" || Math.random() > 0.7
    };

    gears.push(newGear);
    return newGear;
}

function connectGears() {
    // Connect nearby gears for realistic mechanical interaction
    for (let i = 0; i < gears.length; i++) {
        for (let j = i + 1; j < gears.length; j++) {
            const gear1 = gears[i];
            const gear2 = gears[j];

            const distance = Math.sqrt(
                Math.pow(gear1.x - gear2.x, 2) + Math.pow(gear1.y - gear2.y, 2)
            );

            // Connect gears if they're close enough to mesh
            const connectionDistance = (gear1.size + gear2.size) / 2 + 20;
            if (distance < connectionDistance) {
                gear1.connectedGears.push(gear2);
                gear2.connectedGears.push(gear1);
            }
        }
    }
}

function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Calculate mouse velocity
    const deltaX = Math.abs(mouseX - event.movementX);
    const deltaY = Math.abs(mouseY - event.movementY);
    const mouseVelocity = Math.min(1, (deltaX + deltaY) / 100);

    // Update gear speeds based on mouse velocity
    gears.forEach(gear => {
        const distanceToMouse = Math.sqrt(
            Math.pow(mouseX - (gear.x + gear.size / 2), 2) +
            Math.pow(mouseY - (gear.y + gear.size / 2), 2)
        );

        const proximityFactor = distanceEaseFactor(distanceToMouse, 500);
        gear.targetSpeed = gear.baseSpeed * (1 + mouseVelocity * 2 * proximityFactor);
    });
}

function animateGears() {
    const now = performance.now();
    const deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    gears.forEach(gear => {
        // Smoothly adjust speed
        gear.currentSpeed = lerp(gear.currentSpeed, gear.targetSpeed, 0.1);

        // Calculate gear ratio effects for connected gears
        gear.connectedGears.forEach(connectedGear => {
            const gearRatio = gear.teeth / connectedGear.teeth;
            const expectedSpeed = gear.currentSpeed * gearRatio * (gear.isClockwise === connectedGear.isClockwise ? -1 : 1);
            connectedGear.targetSpeed = lerp(connectedGear.targetSpeed, expectedSpeed, 0.05);
        });

        // Apply rotation with direction
        const rotationDirection = gear.isClockwise ? 1 : -1;
        gear.rotation += gear.currentSpeed * deltaTime * 100 * rotationDirection;

        // Calculate glow intensity based on speed
        gear.glowIntensity = Math.min(1, Math.abs(gear.currentSpeed) * 2);

        // Enhanced transform with glow effects
        const glowFilter = gear.glowIntensity > 0.3 ?
            `drop-shadow(0 0 ${gear.glowIntensity * 20}px ${getMaterialColor(gear.material)}80)` : "";

        gear.element.style.transform = `translate(${gear.x}px, ${gear.y}px) rotate(${gear.rotation}deg)`;
        gear.element.style.filter = gear.element.style.filter.replace(/drop-shadow\([^)]*\)/g, "") + " " + glowFilter;

        // Add steam emission for active gears
        if (gear.steamEmission && gear.glowIntensity > 0.5 && Math.random() > 0.95) {
            createSteamPuff(gear.x + gear.size / 2, gear.y + gear.size / 2);
        }

        // Add mechanical sound effect simulation (visual feedback)
        if (gear.gearType === "massive" && Math.abs(gear.currentSpeed) > 0.3) {
            addMechanicalPulse(gear);
        }
    });

    animationFrameId = requestAnimationFrame(animateGears);
}

function getMaterialColor(material: "brass" | "copper" | "steel" | "bronze"): string {
    const colors = {
        brass: "#B88C4F",
        copper: "#C55A11",
        steel: "#A1A1A1",
        bronze: "#CD7F32"
    };
    return colors[material];
}

function createSteamPuff(x: number, y: number) {
    const steam = document.createElement("div");
    steam.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: steamRise 2s ease-out forwards;
    `;

    document.body.appendChild(steam);

    // Remove after animation
    setTimeout(() => {
        if (steam.parentNode) {
            steam.parentNode.removeChild(steam);
        }
    }, 2000);
}

function addMechanicalPulse(gear: Gear) {
    if (Math.random() > 0.98) { // Rare pulse effect
        gear.element.style.transform += " scale(1.05)";
        setTimeout(() => {
            gear.element.style.transform = gear.element.style.transform.replace(" scale(1.05)", "");
        }, 100);
    }
}

export function stop() {
    gears.forEach(gear => {
        if (gear.element.parentNode) {
            gear.element.parentNode.removeChild(gear.element);
        }
    });
    gears.length = 0;

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    document.removeEventListener("mousemove", handleMouseMove);
}
