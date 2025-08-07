/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

import * as CRTFilter from "./components/CRTFilter";
import * as GearAnimation from "./components/GearAnimation";
import { hideLoadingOverlay, showLoadingOverlay } from "./components/LoadingOverlay";
import * as PressureGauge from "./components/PressureGauge";
import { QuickActions } from "./components/QuickActions";
import * as SteamEffect from "./components/SteamEffect";
import * as SteamPipes from "./components/SteamPipesBackground";
import * as TerminalDisplay from "./components/TerminalDisplay";
import { injectSpectralStyles } from "./utils/domUtils";
import { settings } from "./utils/settingsStore";

let isPluginActive = false;
let quickActions: QuickActions | null = null;

export default definePlugin({
    name: "The Spectral Place",
    description: "SteamPunk + Retro themed environment",
    authors: [{ name: "PhrogsHabitat", id: 788145360429252610n }],
    version: "1.0.0",
    settings,
    async start() {
        isPluginActive = true;
        showLoadingOverlay();

        // 1. Inject custom styles
        await injectSpectralStyles();

        // 2. Initialize enhanced components
        if (settings.store.showSteamBackground) await SteamPipes.setup();
        if (settings.store.enableSteam) SteamEffect.start();
        if (settings.store.enableGears) GearAnimation.start();
        if (settings.store.enableCRTFilter) CRTFilter.apply();
        if (settings.store.enableTerminal) TerminalDisplay.start();

        // 3. Start new steampunk components
        PressureGauge.startGaugeSystem();
        quickActions = new QuickActions();
        quickActions.render();

        // 3. Hide loading overlay with delay
        setTimeout(hideLoadingOverlay, 500);
    },
    stop() {
        isPluginActive = false;

        // Stop all components
        SteamPipes.remove();
        SteamEffect.stop();
        GearAnimation.stop();
        CRTFilter.remove();
        TerminalDisplay.stop();

        // Stop new steampunk components
        PressureGauge.stopGaugeSystem();
        if (quickActions) {
            quickActions.remove();
            quickActions = null;
        }

        hideLoadingOverlay();
    },
});
