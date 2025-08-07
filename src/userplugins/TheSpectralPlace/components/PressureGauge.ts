/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { COLORS } from "../utils/Constants";

interface PressureGauge {
    element: HTMLDivElement;
    needle: HTMLDivElement;
    value: number;
    maxValue: number;
    label: string;
    position: { x: number; y: number; };
    size: number;
    isActive: boolean;
}

const pressureGauges: PressureGauge[] = [];
let animationFrameId: number | null = null;

export function createPressureGauge(
    x: number,
    y: number,
    size: number = 80,
    label: string = "PRESSURE",
    maxValue: number = 100
): PressureGauge {
    const container = document.createElement("div");
    container.className = "spectral-pressure-gauge";
    container.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background:
            radial-gradient(circle at 50% 50%, ${COLORS.BRASS_LIGHT} 0%, ${COLORS.BRASS} 40%, ${COLORS.BRASS_DARK} 100%),
            conic-gradient(from 0deg, ${COLORS.COPPER_DARK}, ${COLORS.BRASS}, ${COLORS.COPPER_DARK});
        border: 3px solid ${COLORS.BRASS_DARK};
        border-radius: 50%;
        box-shadow:
            inset 0 0 10px rgba(0,0,0,0.5),
            0 4px 8px rgba(0,0,0,0.3),
            0 0 20px ${COLORS.BRASS}40;
        z-index: 1000;
        pointer-events: none;
        font-family: 'Courier New', monospace;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    `;

    // Add gauge face markings
    const face = document.createElement("div");
    face.style.cssText = `
        position: absolute;
        width: 90%;
        height: 90%;
        border: 1px solid ${COLORS.BRASS_DARK};
        border-radius: 50%;
        background:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2) 0%, transparent 50%);
    `;

    // Add scale markings
    for (let i = 0; i <= 10; i++) {
        const mark = document.createElement("div");
        const angle = (i * 18) - 90; // -90 to 90 degrees
        const isMainMark = i % 2 === 0;

        mark.style.cssText = `
            position: absolute;
            width: ${isMainMark ? "2px" : "1px"};
            height: ${isMainMark ? "12px" : "8px"};
            background: ${COLORS.BRASS_DARK};
            top: 5px;
            left: 50%;
            transform-origin: 50% ${size / 2 - 5}px;
            transform: translateX(-50%) rotate(${angle}deg);
        `;
        face.appendChild(mark);
    }

    // Add numbers
    for (let i = 0; i <= 10; i += 2) {
        const number = document.createElement("div");
        const angle = (i * 18) - 90;
        const value = Math.round((i / 10) * maxValue);

        number.textContent = value.toString();
        number.style.cssText = `
            position: absolute;
            font-size: ${size * 0.12}px;
            font-weight: bold;
            color: ${COLORS.BRASS_DARK};
            text-shadow: 0 0 3px ${COLORS.BRASS_LIGHT};
            transform: rotate(${angle}deg) translateY(-${size * 0.35}px) rotate(-${angle}deg);
            left: 50%;
            top: 50%;
            transform-origin: 0 0;
            margin-left: -${size * 0.06}px;
            margin-top: -${size * 0.06}px;
        `;
        face.appendChild(number);
    }

    // Create needle
    const needle = document.createElement("div");
    needle.style.cssText = `
        position: absolute;
        width: 2px;
        height: ${size * 0.35}px;
        background: linear-gradient(to top, ${COLORS.COPPER_DARK}, ${COLORS.COPPER_LIGHT});
        top: 50%;
        left: 50%;
        transform-origin: 50% 100%;
        transform: translateX(-50%) translateY(-100%) rotate(-90deg);
        border-radius: 1px;
        box-shadow: 0 0 5px ${COLORS.COPPER};
        z-index: 2;
    `;

    // Add center hub
    const hub = document.createElement("div");
    hub.style.cssText = `
        position: absolute;
        width: ${size * 0.15}px;
        height: ${size * 0.15}px;
        background: radial-gradient(circle, ${COLORS.BRASS_LIGHT}, ${COLORS.BRASS_DARK});
        border: 1px solid ${COLORS.BRASS_DARK};
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
    `;

    // Add label
    const labelElement = document.createElement("div");
    labelElement.textContent = label;
    labelElement.style.cssText = `
        position: absolute;
        bottom: ${size * 0.2}px;
        left: 50%;
        transform: translateX(-50%);
        font-size: ${size * 0.1}px;
        font-weight: bold;
        color: ${COLORS.BRASS_DARK};
        text-shadow: 0 0 3px ${COLORS.BRASS_LIGHT};
        letter-spacing: 1px;
    `;

    container.appendChild(face);
    container.appendChild(needle);
    container.appendChild(hub);
    container.appendChild(labelElement);
    document.body.appendChild(container);

    const gauge: PressureGauge = {
        element: container,
        needle: needle,
        value: 0,
        maxValue: maxValue,
        label: label,
        position: { x, y },
        size: size,
        isActive: true
    };

    pressureGauges.push(gauge);
    return gauge;
}

export function updateGaugeValue(gauge: PressureGauge, value: number) {
    gauge.value = Math.max(0, Math.min(gauge.maxValue, value));
    const percentage = gauge.value / gauge.maxValue;
    const angle = (percentage * 180) - 90; // -90 to 90 degrees

    gauge.needle.style.transform = `translateX(-50%) translateY(-100%) rotate(${angle}deg)`;

    // Add glow effect for high values
    if (percentage > 0.8) {
        gauge.needle.style.boxShadow = `0 0 10px ${COLORS.COPPER}, 0 0 20px ${COLORS.COPPER}`;
        gauge.element.style.boxShadow += `, 0 0 30px ${COLORS.COPPER}40`;
    } else {
        gauge.needle.style.boxShadow = `0 0 5px ${COLORS.COPPER}`;
    }
}

export function animateGaugeValue(gauge: PressureGauge, targetValue: number, duration: number = 1000) {
    const startValue = gauge.value;
    const startTime = performance.now();

    function animate(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (targetValue - startValue) * easeProgress;

        updateGaugeValue(gauge, currentValue);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

export function removeGauge(gauge: PressureGauge) {
    const index = pressureGauges.indexOf(gauge);
    if (index > -1) {
        pressureGauges.splice(index, 1);
        if (gauge.element.parentNode) {
            gauge.element.parentNode.removeChild(gauge.element);
        }
    }
}

export function removeAllGauges() {
    pressureGauges.forEach(gauge => {
        if (gauge.element.parentNode) {
            gauge.element.parentNode.removeChild(gauge.element);
        }
    });
    pressureGauges.length = 0;
}

export function startGaugeSystem() {
    // Create system monitoring gauges
    const cpuGauge = createPressureGauge(20, 20, 60, "CPU", 100);
    const memGauge = createPressureGauge(20, 100, 60, "MEM", 100);
    const steamGauge = createPressureGauge(20, 180, 60, "STEAM", 100);

    // Simulate system monitoring
    function updateSystemGauges() {
        // Simulate CPU usage
        const cpuUsage = 20 + Math.random() * 60 + Math.sin(Date.now() * 0.001) * 20;
        animateGaugeValue(cpuGauge, cpuUsage, 500);

        // Simulate memory usage
        const memUsage = 30 + Math.random() * 50;
        animateGaugeValue(memGauge, memUsage, 800);

        // Simulate steam pressure
        const steamPressure = 40 + Math.random() * 40 + Math.cos(Date.now() * 0.0008) * 20;
        animateGaugeValue(steamGauge, steamPressure, 600);
    }

    // Update gauges every 2 seconds
    setInterval(updateSystemGauges, 2000);
    updateSystemGauges(); // Initial update
}

export function stopGaugeSystem() {
    removeAllGauges();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}
