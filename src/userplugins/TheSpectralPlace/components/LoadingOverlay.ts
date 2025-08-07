/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

let loadingOverlay: HTMLDivElement | null = null;

export function showLoadingOverlay() {
    if (loadingOverlay) return;

    loadingOverlay = document.createElement("div");
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 24px;
        backdrop-filter: blur(5px);
    `;

    const text = document.createElement("div");
    text.textContent = "Loading The Spectral Place...";
    loadingOverlay.appendChild(text);

    document.body.appendChild(loadingOverlay);
}

export function hideLoadingOverlay() {
    if (loadingOverlay && loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
        loadingOverlay = null;
    }
}
