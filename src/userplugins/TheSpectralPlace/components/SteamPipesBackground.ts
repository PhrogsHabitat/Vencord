/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ASSETS } from "../utils/Constants";
import { lerp } from "../utils/helpers";
import { settings } from "../utils/settingsStore";
import { hideLoadingOverlay, showLoadingOverlay } from "./LoadingOverlay";
import * as SteamEffect from "./SteamEffect";

let steamBackground: HTMLVideoElement | null = null;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let animationFrameId: number | null = null;
let lastFrameTime = 0;
const basePlaybackRate = 1.0;
let targetPlaybackRate = 1.0;
let currentPlaybackRate = 1.0;

export async function setup() {
    if (steamBackground) return;
    showLoadingOverlay();

    // Create video background
    steamBackground = document.createElement("video");
    steamBackground.src = ASSETS.STEAM_BACKGROUND;
    steamBackground.autoplay = true;
    steamBackground.loop = true;
    steamBackground.muted = true;
    steamBackground.playsInline = true;
    steamBackground.preload = "auto";
    steamBackground.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -2;
        transform: scale(1.1);
        transform-origin: center;
        will-change: transform;
    `;

    // Error handling
    steamBackground.onerror = () => {
        console.error("Background video failed to load");
        hideLoadingOverlay();
    };

    // Wait for video to load
    await new Promise<void>(resolve => {
        steamBackground.addEventListener("canplaythrough", () => resolve(), { once: true });
        document.body.appendChild(steamBackground);
    });

    // Start playback
    try {
        await steamBackground.play();
    } catch (e) {
        console.error("Video play error:", e);
    }

    // Add mouse move listener
    document.addEventListener("mousemove", handleMouseMove);

    // Start animation loop
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(animateBackground);

    // Setup steam effect
    if (settings.store.enableSteam) SteamEffect.start();

    hideLoadingOverlay();
}

function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Set target parallax offset (increased intensity)
    targetX = (window.innerWidth / 2 - mouseX) * 0.03;
    targetY = (window.innerHeight / 2 - mouseY) * 0.03;

    // Calculate mouse velocity for playback rate
    const deltaX = Math.abs(mouseX - event.movementX);
    const deltaY = Math.abs(mouseY - event.movementY);
    const mouseVelocity = Math.min(2, (deltaX + deltaY) / 50);
    targetPlaybackRate = 1.0 + mouseVelocity * 0.5;
}

function animateBackground() {
    const now = performance.now();
    const deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    // Apply easing to position
    currentX = lerp(currentX, targetX, 0.1);
    currentY = lerp(currentY, targetY, 0.1);

    // Apply easing to playback rate
    currentPlaybackRate = lerp(currentPlaybackRate, targetPlaybackRate, 0.1);

    // Apply transformations
    if (steamBackground) {
        steamBackground.style.transform = `scale(1.1) translate(${currentX}px, ${currentY}px)`;

        // Set playback rate with clamping
        const rate = Math.max(0.5, Math.min(2.0, currentPlaybackRate));
        steamBackground.playbackRate = rate;
    }

    animationFrameId = requestAnimationFrame(animateBackground);
}

export function remove() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    if (steamBackground) {
        steamBackground.pause();
        if (steamBackground.parentNode) {
            steamBackground.parentNode.removeChild(steamBackground);
        }
        steamBackground = null;
    }

    SteamEffect.stop();
    document.removeEventListener("mousemove", handleMouseMove);
}
