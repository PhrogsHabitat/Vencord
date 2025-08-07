/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

let spectralStyle: HTMLStyleElement | null = null;
import spectralCss from "./SpectralPlaceCss";

export async function injectSpectralStyles() {
    if (spectralStyle) return;

    const style = document.createElement("style");
    style.id = "stylesTheSpectralPlace";
    style.textContent = spectralCss;
    document.head.appendChild(style);
    spectralStyle = style;
}

export function removeSpectralStyles() {
    if (spectralStyle?.parentNode) {
        spectralStyle.parentNode.removeChild(spectralStyle);
        spectralStyle = null;
    }
}
