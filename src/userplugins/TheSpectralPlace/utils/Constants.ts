/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const ASSETS = {
    // SteamPunk Assets
    STEAM_BACKGROUND: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/graphics/SPECSShit.mp4",
    GEAR_LARGE: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/graphics/bigGear.png",
    GEAR_MEDIUM: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/graphics/medGear.png",
    GEAR_SMALL: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/graphics/smallGear.png",
    PRESSURE_GAUGE: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/graphics/pressGauge.png",

    // Retro Assets
    CRT_OVERLAY: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/graphics/crtOverlay.png",
    TERMINAL_FONT: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/fonts/gamePaused.otf",

    // Sounds
    GEAR_SOUND: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/sounds/gearShit.mp3",
    STEAM_SOUND: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/sounds/steamHiss.mp3",
    TERMINAL_BEEP: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/sounds/terminalShit.mp3",

    // Particles
    STEAM_PARTICLE: "https://phrogshabitat.github.io/HabitatPlugin/autoUpdate/assets/Specs/particles/steamParticle.png"
};

export const PARALLAX_LAYERS = {
    BACKGROUND: 0.1,
    STEAM: 0.2,
    GEARS_FAR: 0.3,
    GEARS_MID: 0.5,
    GEARS_NEAR: 0.8,
    UI: 1.0
};

// Add to existing Constants
export const Z_INDEX = {
    BACKGROUND: PARALLAX_LAYERS.BACKGROUND * 100 - 1,
    STEAM: PARALLAX_LAYERS.STEAM * 100,
    GEARS_FAR: PARALLAX_LAYERS.GEARS_FAR * 100,
    GEARS_MID: PARALLAX_LAYERS.GEARS_MID * 100,
    GEARS_NEAR: PARALLAX_LAYERS.GEARS_NEAR * 100,
    UI: PARALLAX_LAYERS.UI * 100,
    CRT: 9998
};
export const COLORS = {
    // Primary Steampunk Metals
    BRASS: "#B88C4F",
    BRASS_LIGHT: "#D4A574",
    BRASS_DARK: "#8B6914",
    COPPER: "#C55A11",
    COPPER_LIGHT: "#E67E22",
    COPPER_DARK: "#A0522D",
    BRONZE: "#CD7F32",
    BRONZE_LIGHT: "#DAA520",
    BRONZE_DARK: "#8B4513",

    // Industrial Metals
    STEEL: "#A1A1A1",
    STEEL_LIGHT: "#C0C0C0",
    STEEL_DARK: "#696969",
    IRON: "#4A4A4A",
    IRON_RUST: "#8B4513",
    PEWTER: "#96A8A1",

    // Wood and Leather Tones
    DARK_WOOD: "#3A2E1E",
    AGED_WOOD: "#5D4E37",
    MAHOGANY: "#C04000",
    LEATHER_BROWN: "#964B00",
    LEATHER_TAN: "#D2B48C",
    LEATHER_DARK: "#654321",

    // Vintage Glass and Crystal
    AMBER_GLASS: "#FFBF00",
    GREEN_GLASS: "#50C878",
    CRYSTAL_BLUE: "#4682B4",

    // Retro Display Colors
    RETRO_GREEN: "#00FF44",
    RETRO_AMBER: "#FF9D00",
    RETRO_BLUE: "#00BFFF",
    PHOSPHOR_GREEN: "#39FF14",
    CATHODE_AMBER: "#FFBF00",

    // Steam and Smoke
    STEAM_WHITE: "#F5F5F5",
    STEAM_GRAY: "#D3D3D3",
    SMOKE_DARK: "#2F2F2F",

    // Accent Colors
    GOLD_ACCENT: "#FFD700",
    SILVER_ACCENT: "#C0C0C0",
    EMERALD_ACCENT: "#50C878",
    RUBY_ACCENT: "#E0115F",

    // Background Tones
    PARCHMENT: "#F4E4BC",
    SEPIA: "#704214",
    CHARCOAL: "#36454F",
    SOOT: "#1C1C1C"
};

// Note: Complex gradients, shadows, patterns, animations, and dimensions
// have been removed for performance optimization. The theme now uses
// simple color variables and minimal effects for better performance.
