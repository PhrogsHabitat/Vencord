/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

import * as DynamicWeather from "./components/DynamicWeather";
import * as ForestBackground from "./components/ForestBackground";
import { hideLoadingOverlay, showLoadingOverlay } from "./components/LoadingOverlay";
import { QuickActions } from "./components/QuickActions";
import * as ThunderEffect from "./components/ThunderEffect";
import { injectHabitatStyles } from "./utils/domUtils";
import { settings } from "./utils/settingsStore";

let isPluginActive = false;
let quickActions: QuickActions | null = null;

// Accessibility support
function checkAccessibilityPreferences(): void {
    try {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            console.log("Reduced motion preference detected, adjusting effects");

            // Reduce rain speed and intensity
            if (settings.store.rainSpeed > 0.5) {
                settings.store.rainSpeed = 0.5;
            }
            if (settings.store.rainIntensity > 0.3) {
                settings.store.rainIntensity = 0.3;
            }

            // Disable thunder effects for photosensitivity
            settings.store.enableThunder = false;

            // Show notification to user
            showAccessibilityNotification("Reduced motion detected. Some effects have been disabled for accessibility.");
        }
    } catch (e) {
        console.warn("Failed to check accessibility preferences:", e);
    }
}

function showAccessibilityNotification(message: string): void {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #43b581;
        color: white;
        padding: 12px 16px;
        border-radius: 4px;
        font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        z-index: 10001;
        max-width: 300px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    notification.textContent = `HabitatRain: ${message}`;
    document.body.appendChild(notification);

    // Auto-remove after 8 seconds (longer for accessibility)
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 8000);
}

export default definePlugin({
    name: "Habitat Rain",
    description: "A cozy plugin that makes you feel at home in the rain.",
    authors: [{ name: "PhrogsHabitat", id: 788145360429252610n }],
    version: "3.0.2",

    // Enhanced Vencord plugin metadata
    enabledByDefault: false,
    required: false,

    settings,
    async start() {
        isPluginActive = true;
        showLoadingOverlay();

        try {
            // 1. Check accessibility preferences first
            checkAccessibilityPreferences();

            // 2. Inject CSS styles
            await injectHabitatStyles();

            // 3. Initialize components in parallel where possible
            const initPromises: Promise<any>[] = [];

            if (settings.store.showForestBackground) {
                initPromises.push(ForestBackground.setup());
            }

            if (settings.store.enableMist) {
                initPromises.push(import("./components/MistEffect").then(m => m.setup()));
            }

            // Wait for async components to initialize
            await Promise.allSettled(initPromises);

            // Initialize synchronous components
            ThunderEffect.start(settings.store.preset || "Heavy");
            if (settings.store.dynamicWeather) DynamicWeather.start();

            // 3. Add quick actions UI
            quickActions = new QuickActions();

            console.log("HabitatRain plugin initialized successfully");
        } catch (error) {
            console.error("HabitatRain plugin initialization failed:", error);
            // Show user notification about the error
            this.showInitializationError(error);
        } finally {
            // Always hide loading overlay
            hideLoadingOverlay();
        }
    },

    showInitializationError(error: any) {
        // Create a user-friendly error notification
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

        notification.textContent = `HabitatRain failed to load: ${error.message || error}`;
        document.body.appendChild(notification);

        // Auto-remove after 6 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 6000);
    },
    stop() {
        isPluginActive = false;

        try {
            // Hide loading overlay first
            hideLoadingOverlay();

            // Stop all components in reverse order of initialization
            ThunderEffect.stop();
            DynamicWeather.stop();
            ForestBackground.remove();

            // Handle async mist effect cleanup
            import("./components/MistEffect").then(m => m.remove()).catch(e => {
                console.warn("Failed to cleanup MistEffect:", e);
            });

            // Clean up quick actions
            if (quickActions) {
                quickActions.remove();
                quickActions = null;
            }

            console.log("HabitatRain plugin stopped successfully");
        } catch (error) {
            console.error("Error during HabitatRain plugin cleanup:", error);
        }
    },
});
