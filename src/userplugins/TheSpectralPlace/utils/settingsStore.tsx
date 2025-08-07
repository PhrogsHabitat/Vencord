/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, OptionType } from "@api/Settings";

export const settings = definePluginSettings({
    showSteamBackground: {
        type: OptionType.BOOLEAN,
        description: "Show SteamPunk background",
        default: true,
        onChange: (value: boolean) => {
            if (value) {
                import("../components/SteamPipesBackground").then(m => m.setup());
            } else {
                import("../components/SteamPipesBackground").then(m => m.remove());
            }
        },
    },
    enableGears: {
        type: OptionType.BOOLEAN,
        description: "Enable rotating gears",
        default: true,
        onChange: (value: boolean) => {
            if (value) {
                import("../components/GearAnimation").then(m => m.start());
            } else {
                import("../components/GearAnimation").then(m => m.stop());
            }
        },
    },
    enableSteam: {
        type: OptionType.BOOLEAN,
        description: "Enable steam effects",
        default: true,
        onChange: (value: boolean) => {
            if (value) {
                import("../components/SteamEffect").then(m => m.start());
            } else {
                import("../components/SteamEffect").then(m => m.stop());
            }
        },
    },
    steamIntensity: {
        type: OptionType.SLIDER,
        description: "Steam pressure level",
        default: 50,
        markers: [0, 25, 50, 75, 100],
        onChange: () => {
            import("../components/SteamEffect").then(m => m.update());
        }
    },
    enableCRTFilter: {
        type: OptionType.BOOLEAN,
        description: "Enable retro CRT effect",
        default: true,
        onChange: (value: boolean) => {
            if (value) {
                import("../components/CRTFilter").then(m => m.apply());
            } else {
                import("../components/CRTFilter").then(m => m.remove());
            }
        },
    },
    enableTerminal: {
        type: OptionType.BOOLEAN,
        description: "Show system terminal",
        default: true,
        onChange: (value: boolean) => {
            if (value) {
                import("../components/TerminalDisplay").then(m => m.start());
            } else {
                import("../components/TerminalDisplay").then(m => m.stop());
            }
        },
    },
    terminalTheme: {
        type: OptionType.SELECT,
        description: "Terminal color scheme",
        options: [
            { label: "🟠 Amber", value: "AMBER" },
            { label: "🟢 Green", value: "GREEN" },
            { label: "🔵 Blue", value: "BLUE" }
        ],
        default: "GREEN",
        onChange: () => {
            import("../components/TerminalDisplay").then(m => m.updateTheme());
        }
    },
    steamStyle: {
        type: OptionType.SELECT,
        description: "Steam effect style",
        options: [
            { label: "Light Mist", value: "MIST" },
            { label: "Industrial Pipes", value: "PIPES" },
            { label: "Mechanical Vents", value: "VENTS" }
        ],
        default: "PIPES"
    }
});
