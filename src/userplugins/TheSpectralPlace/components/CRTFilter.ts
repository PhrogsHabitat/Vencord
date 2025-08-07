/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

let crtOverlay: HTMLDivElement | null = null;
let animationFrameId: number | null = null;
let lastFrameTime = 0;

export function apply() {
    if (crtOverlay) return;

    crtOverlay = document.createElement("div");
    crtOverlay.className = "crt-overlay";
    crtOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:
            linear-gradient(rgba(0, 0, 0, 0.1) 50%,
            transparent 50%),
            linear-gradient(90deg,
                rgba(255, 0, 0, 0.06) 0%,
                rgba(0, 255, 0, 0.02) 33.33%,
                rgba(0, 0, 255, 0.06) 66.66%,
                rgba(0, 0, 0, 0) 100%
            );
        background-size: 100% 4px, 4px 100%;
        opacity: 0.1;
        pointer-events: none;
        z-index: 9998;
        mix-blend-mode: overlay;
    `;

    document.body.appendChild(crtOverlay);

    // Start subtle flicker animation
    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(animateFlicker);
}

function animateFlicker() {
    const now = performance.now();
    const deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    if (crtOverlay) {
        // Subtle flicker effect
        const flicker = Math.sin(now * 0.002) * 0.02;
        crtOverlay.style.opacity = `${0.1 + flicker}`;

        // Move scanlines
        const position = (now * 0.05) % 100;
        crtOverlay.style.backgroundPosition = `0 ${position}%`;
    }

    animationFrameId = requestAnimationFrame(animateFlicker);
}

export function remove() {
    if (crtOverlay && crtOverlay.parentNode) {
        crtOverlay.parentNode.removeChild(crtOverlay);
        crtOverlay = null;
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}
