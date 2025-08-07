/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { COLORS } from "../utils/Constants";
import { settings } from "../utils/settingsStore";

export class QuickActions {
    private container: HTMLDivElement | null = null;

    constructor() {
        this.render();
    }

    render() {
        // Remove existing container if it exists
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }

        this.container = document.createElement("div");
        this.container.className = "spectral-quick-actions";
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, ${COLORS.BRASS_DARK} 0%, ${COLORS.BRASS} 50%, ${COLORS.BRASS_LIGHT} 100%);
            border: 3px solid ${COLORS.BRASS_DARK};
            border-radius: 8px;
            padding: 15px;
            box-shadow:
                inset 0 0 10px rgba(0,0,0,0.3),
                0 8px 16px rgba(0,0,0,0.4),
                0 0 20px ${COLORS.BRASS}40;
            font-family: 'Courier New', monospace;
            z-index: 10000;
            min-width: 200px;
        `;

        // Create header with decorative elements
        const header = document.createElement("div");
        header.style.cssText = `
            color: ${COLORS.BRASS_DARK};
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 15px;
            text-align: center;
            text-shadow: 0 0 5px ${COLORS.BRASS_LIGHT};
            letter-spacing: 2px;
            position: relative;
            padding: 5px 0;
            border-bottom: 2px solid ${COLORS.BRASS_DARK};
        `;
        header.textContent = "⚙ SPECTRAL CONTROLS ⚙";

        // Create controls container
        const controlsContainer = document.createElement("div");
        controlsContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 10px;
        `;

        // Create enhanced mechanical switches
        const switches = [
            { action: "toggleBackground", label: "STEAM BACKGROUND", enabled: settings.store.showSteamBackground },
            { action: "toggleGears", label: "GEAR SYSTEM", enabled: settings.store.enableGears },
            { action: "toggleCRT", label: "CRT FILTER", enabled: settings.store.enableCRTFilter },
            { action: "toggleTerminal", label: "TERMINAL", enabled: settings.store.enableTerminal }
        ];

        switches.forEach(switchConfig => {
            const switchElement = this.createMechanicalSwitch(switchConfig.action, switchConfig.label, switchConfig.enabled);
            controlsContainer.appendChild(switchElement);
        });

        this.container.appendChild(header);
        this.container.appendChild(controlsContainer);

        // Add corner rivets
        this.addCornerRivets(this.container);

        // Add event listeners
        this.container.querySelector('[data-action="toggleBackground"]')
            ?.addEventListener("click", () => {
                settings.store.showSteamBackground = !settings.store.showSteamBackground;
                this.render(); // Re-render with updated state
            });

        this.container.querySelector('[data-action="toggleGears"]')
            ?.addEventListener("click", () => {
                settings.store.enableGears = !settings.store.enableGears;
                this.render();
            });

        this.container.querySelector('[data-action="toggleCRT"]')
            ?.addEventListener("click", () => {
                settings.store.enableCRTFilter = !settings.store.enableCRTFilter;
                this.render();
            });

        this.container.querySelector('[data-action="toggleTerminal"]')
            ?.addEventListener("click", () => {
                settings.store.enableTerminal = !settings.store.enableTerminal;
                this.render();
            });

        document.body.appendChild(this.container);
    }

    private createMechanicalSwitch(action: string, label: string, enabled: boolean): HTMLDivElement {
        const switchContainer = document.createElement("div");
        switchContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px;
            background: linear-gradient(135deg, ${COLORS.COPPER_DARK} 0%, ${COLORS.COPPER} 50%, ${COLORS.COPPER_LIGHT} 100%);
            border: 2px solid ${COLORS.COPPER_DARK};
            border-radius: 6px;
            box-shadow:
                inset 0 0 5px rgba(0,0,0,0.3),
                0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        `;

        // Add label
        const labelElement = document.createElement("span");
        labelElement.textContent = label;
        labelElement.style.cssText = `
            color: ${COLORS.BRASS_DARK};
            font-size: 10px;
            font-weight: bold;
            text-shadow: 0 0 3px ${COLORS.BRASS_LIGHT};
            letter-spacing: 1px;
            flex: 1;
        `;

        // Create toggle switch
        const toggleSwitch = document.createElement("div");
        toggleSwitch.style.cssText = `
            width: 40px;
            height: 20px;
            background: ${enabled ? COLORS.RETRO_GREEN : COLORS.STEEL_DARK};
            border: 2px solid ${COLORS.BRASS_DARK};
            border-radius: 10px;
            position: relative;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
            transition: all 0.3s ease;
        `;

        // Create switch handle
        const handle = document.createElement("div");
        handle.style.cssText = `
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, ${COLORS.BRASS_LIGHT}, ${COLORS.BRASS_DARK});
            border: 1px solid ${COLORS.BRASS_DARK};
            border-radius: 50%;
            position: absolute;
            top: 1px;
            left: ${enabled ? "21px" : "1px"};
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;

        // Add status indicator
        const statusIndicator = document.createElement("div");
        statusIndicator.textContent = enabled ? "ON" : "OFF";
        statusIndicator.style.cssText = `
            font-size: 8px;
            font-weight: bold;
            color: ${enabled ? COLORS.RETRO_GREEN : COLORS.STEEL};
            text-shadow: 0 0 3px currentColor;
            margin-left: 8px;
            min-width: 20px;
        `;

        toggleSwitch.appendChild(handle);
        switchContainer.appendChild(labelElement);
        switchContainer.appendChild(toggleSwitch);
        switchContainer.appendChild(statusIndicator);

        // Add data attribute for event handling
        switchContainer.setAttribute("data-action", action);

        // Add hover effects
        switchContainer.addEventListener("mouseenter", () => {
            switchContainer.style.transform = "translateY(-1px)";
            switchContainer.style.boxShadow = `
                inset 0 0 5px rgba(0,0,0,0.3),
                0 4px 8px rgba(0,0,0,0.4),
                0 0 10px ${COLORS.COPPER}40
            `;
        });

        switchContainer.addEventListener("mouseleave", () => {
            switchContainer.style.transform = "translateY(0)";
            switchContainer.style.boxShadow = `
                inset 0 0 5px rgba(0,0,0,0.3),
                0 2px 4px rgba(0,0,0,0.3)
            `;
        });

        return switchContainer;
    }

    private addCornerRivets(container: HTMLDivElement): void {
        const rivetPositions = [
            { top: "5px", left: "5px" },
            { top: "5px", right: "5px" },
            { bottom: "5px", left: "5px" },
            { bottom: "5px", right: "5px" }
        ];

        rivetPositions.forEach(pos => {
            const rivet = document.createElement("div");
            rivet.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: radial-gradient(circle, ${COLORS.BRASS_LIGHT}, ${COLORS.BRASS_DARK});
                border: 1px solid ${COLORS.BRASS_DARK};
                border-radius: 50%;
                box-shadow: inset 0 0 3px rgba(0,0,0,0.5);
                ${Object.entries(pos).map(([key, value]) => `${key}: ${value}`).join("; ")};
                pointer-events: none;
            `;
            container.appendChild(rivet);
        });
    }

    remove() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
            this.container = null;
        }
    }
}
