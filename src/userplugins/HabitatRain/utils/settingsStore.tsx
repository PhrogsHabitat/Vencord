/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, OptionType } from "@api/Settings";
import { React } from "@webpack/common";

import { defaultConfigs } from "./configs";

// Helper to safely access settings with proper error handling
function safeSet<T>(setter: (value: T) => void, value: T, retries = 3): void {
    try {
        setter(value);
    } catch (e) {
        if (retries > 0) {
            console.warn(`Settings not ready yet, retrying... (${4 - retries}/3)`);
            setTimeout(() => safeSet(setter, value, retries - 1), 100);
        } else {
            console.error("Failed to update setting after multiple attempts:", e);
            showSettingsError("Failed to update setting. Please try again.");
        }
    }
}

// Show user-friendly error notifications for settings
function showSettingsError(message: string): void {
    // Create a simple error notification
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f04747;
        color: white;
        padding: 12px 16px;
        border-radius: 4px;
        font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        z-index: 10001;
        max-width: 300px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    notification.textContent = `HabitatRain Settings: ${message}`;
    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Validate setting values
function validateNumber(value: unknown, min: number, max: number, defaultValue: number): number {
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) {
        console.warn(`Invalid setting value ${value}, using default ${defaultValue}`);
        return defaultValue;
    }
    return num;
}

export const settings = definePluginSettings({
    dynamicWeather: {
        type: OptionType.BOOLEAN,
        description: "Enable dynamic weather simulation with realistic patterns",
        default: false,
        onChange: (value: boolean) => {
            if (value) {
                import("../components/DynamicWeather").then(m => m.start());
            } else {
                import("../components/DynamicWeather").then(m => m.stop());
            }
        },
    },
    preset: {
        type: OptionType.SELECT,
        description: "Choose a rain preset to quickly apply settings.",
        options: [
            { label: "🌧️ Normal Rain", value: "Normal" },
            { label: "🌦️ Slow n' Comfy", value: "Slow" },
            { label: "⛈️ Heavy n' Relaxing", value: "Heavy" },
            { label: "🌧️💧 Downpouring Sadness", value: "Downpour" }
        ],
        default: "Heavy",
        onChange: (preset: string) => {
            import("../components/ThunderEffect").then(m => m.updatePresetSettings(preset));
        },
    },
    enableThunder: {
        type: OptionType.BOOLEAN,
        description: "Enable lightning effects during rain",
        default: true,
        onChange: (value: boolean) => {
            import("../components/ThunderEffect").then(m => value ? m.enableThunder() : m.disableThunder());
        },
    },
    enableMist: {
        type: OptionType.BOOLEAN,
        description: "Enable mist effects in the forest",
        default: true,
        onChange: (value: boolean) => {
            if (value) {
                import("../components/MistEffect").then(m => m.setup());
            } else {
                import("../components/MistEffect").then(m => m.remove());
            }
        },
    },
    mistIntensity: {
        type: OptionType.SLIDER,
        description: "Adjust mist density and visibility",
        default: (defaultConfigs.Heavy.intensity * 0.7),
        min: 0,
        max: 3, // Lowered max for more realistic mist
        step: 0.01,
        markers: [0, 0.25, 0.5, 1, 1.5, 2, 2.5, 3],
        onChange: () => { /* see MistEffect for dynamic link to rain */ },
    },
    rainVolume: {
        type: OptionType.SLIDER,
        description: "Adjust rain sound volume",
        default: defaultConfigs.Heavy.volume,
        min: 0,
        max: 500,
        step: 1,
        markers: [0, 10, 25, 50, 75, 100, 200, 300, 400, 500],
        onChange: () => {
            import("../components/ThunderEffect").then(m => m.updateVolume());
        },
    },
    rainIntensity: {
        type: OptionType.SLIDER,
        description: "Adjust rain density",
        default: defaultConfigs.Heavy.intensity,
        min: 0,
        max: 5,
        step: 0.01,
        markers: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1, 2, 3, 4, 5],
        onChange: () => {
            import("../components/WebGLRainEffect").then(m => m.update());
        },
    },
    rainScale: {
        type: OptionType.NUMBER,
        description: "Adjust raindrop size",
        min: 0.05,
        max: 3.0, // Lowered max for less extreme scaling
        step: 0.01,
        onChange: (value: number) => { /* see WebGLRainEffect for dynamic link to mist */ },
    },
    rainAngle: {
        type: OptionType.SLIDER,
        description: "Adjust rain direction",
        default: 0,
        min: -180,
        max: 180,
        step: 1,
        markers: [-180, -90, -45, -15, 0, 15, 45, 90, 180],
        onChange: (value: number) => {
            const validatedValue = validateNumber(value, -180, 180, 0);
            safeSet(() => {
                settings.store.rainAngle = validatedValue;
                import("../components/WebGLRainEffect").then(m => m.update());
            }, validatedValue);
        },
    },
    rainSpeed: {
        type: OptionType.SLIDER,
        description: "Adjust rain speed",
        default: 1.0,
        min: 0.01,
        max: 10.0,
        step: 0.01,
        markers: [0.01, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0],
        onChange: (value: number) => {
            const validatedValue = validateNumber(value, 0.01, 10.0, 1.0);
            safeSet(() => {
                settings.store.rainSpeed = validatedValue;
                import("../components/WebGLRainEffect").then(m => m.update());
            }, validatedValue);
        },
    },
    enablePuddles: {
        type: OptionType.BOOLEAN,
        description: "Enable puddle reflections (experimental)",
        default: false,
        onChange: (value: boolean) => {
            import("../components/WebGLRainEffect").then(m => m.reset());
        },
    },
    enableLighting: {
        type: OptionType.BOOLEAN,
        description: "Enable dynamic lighting effects (experimental)",
        default: false,
        onChange: (value: boolean) => {
            import("../components/WebGLRainEffect").then(m => m.reset());
        },
    },
    showForestBackground: {
        type: OptionType.BOOLEAN,
        description: "Show the animated forest background",
        default: true,
        onChange: (value: boolean) => {
            if (value) {
                import("../components/ForestBackground").then(m => m.setup());
            } else {
                import("../components/ForestBackground").then(m => m.remove());
            }
        },
    },
    advancedSettings: {
        type: OptionType.COMPONENT,
        description: "Advanced Configuration",
        component: function AdvancedSettingsComponent() {
            // Use settings.store.resetWebGL to trigger reset
            return (
                <div style={{ padding: "10px", backgroundColor: "var(--background-secondary)" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <h3 style={{ margin: 0 }}>Advanced Settings</h3>
                        <p style={{ margin: 0, opacity: 0.7 }}>Configure technical aspects of the plugin</p>
                    </div>
                    <div>
                        <button
                            style={{
                                background: "var(--button-background)",
                                color: "var(--button-text)",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                settings.store.resetWebGL = true;
                            }}
                        >
                            Reset WebGL Context
                        </button>
                    </div>
                </div>
            );
        }
    },
    resetWebGL: {
        type: OptionType.BOOLEAN,
        description: "Internal: triggers WebGL context reset",
        default: false,
        hidden: true,
        onChange: (value: boolean) => {
            if (value) {
                import("../components/WebGLRainEffect").then(m => m.reset());
                // Reset the flag so it can be triggered again
                setTimeout(() => { settings.store.resetWebGL = false; }, 100);
            }
        }
    }
});
