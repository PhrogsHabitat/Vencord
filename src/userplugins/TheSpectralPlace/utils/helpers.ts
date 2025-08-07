/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
}

export function makeDraggable(element: HTMLElement) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    element.addEventListener("mousedown", startDrag);

    function startDrag(e: MouseEvent) {
        if (e.target !== element) return;

        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;

        element.style.cursor = "grabbing";
        element.style.userSelect = "none";

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
    }

    function drag(e: MouseEvent) {
        if (!isDragging) return;

        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        // Constrain to window bounds
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;

        element.style.left = `${Math.max(0, Math.min(maxX, x))}px`;
        element.style.top = `${Math.max(0, Math.min(maxY, y))}px`;
    }

    function stopDrag() {
        isDragging = false;
        element.style.cursor = "grab";
        element.style.userSelect = "auto";

        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);
    }
}

export function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function easeOutQuad(t: number): number {
    return t * (2 - t);
}

export function easeInQuad(t: number): number {
    return t * t;
}

// Frame-rate independent easing
export function smoothLerp(start: number, end: number, factor: number, deltaTime: number): number {
    return start + (end - start) * (1 - Math.pow(factor, deltaTime * 60));
}

// Distance-based easing factor
export function distanceEaseFactor(distance: number, maxDistance: number): number {
    const normalized = Math.min(1, distance / maxDistance);
    return 1 - easeOutQuad(normalized);
}

export function applyParallax(element: HTMLElement, depth: number) {
    const handleMouseMove = (e: MouseEvent) => {
        const x = (window.innerWidth / 2 - e.clientX) * depth;
        const y = (window.innerHeight / 2 - e.clientY) * depth;
        element.style.transform = `translate(${x}px, ${y}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
}
