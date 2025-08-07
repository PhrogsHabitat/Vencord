/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { COLORS } from "../utils/Constants";
import { makeDraggable } from "../utils/helpers";
import { settings } from "../utils/settingsStore";

let terminal: HTMLDivElement | null = null;
let input: HTMLInputElement | null = null;
let output: HTMLDivElement | null = null;

const COMMANDS = {
    help: "Available commands: help, bg [on/off], theme [amber/green/blue]",
    bg: (state: string) => {
        const newState = state === "on";
        settings.store.showSteamBackground = newState;
        return `Background ${newState ? "ENABLED" : "DISABLED"}`;
    },
    theme: (theme: string) => {
        if (["amber", "green", "blue"].includes(theme)) {
            settings.store.terminalTheme = theme.toUpperCase();
            updateTerminalTheme();
            return `Theme set to ${theme}`;
        }
        return "Invalid theme. Options: amber, green, blue";
    }
};

export function start() {
    if (terminal) return;

    terminal = document.createElement("div");
    terminal.className = "terminal-display";
    terminal.style.cssText = `
        position: fixed;
        left: 20px;
        top: ${window.innerHeight - 270}px;
        width: 400px;
        height: 250px;
        z-index: 10000;
        cursor: move;
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid ${COLORS.BRASS};
        border-radius: 4px;
        overflow: hidden;
        font-family: 'Courier New', monospace;
        color: ${COLORS.RETRO_GREEN};
        text-shadow: 0 0 5px ${COLORS.RETRO_GREEN};
    `;

    // Output area
    output = document.createElement("div");
    output.id = "terminal-output";
    output.style.cssText = `
        height: calc(100% - 40px);
        padding: 10px;
        overflow-y: auto;
    `;

    // Input area
    const inputContainer = document.createElement("div");
    inputContainer.style.cssText = `
        display: flex;
        border-top: 1px solid ${COLORS.BRASS};
        padding: 5px;
        background: rgba(0, 0, 0, 0.5);
    `;

    const prompt = document.createElement("span");
    prompt.textContent = "> ";
    prompt.style.marginRight = "5px";

    input = document.createElement("input");
    input.type = "text";
    input.style.cssText = `
        flex: 1;
        background: transparent;
        border: none;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        outline: none;
    `;

    input.addEventListener("keydown", handleCommandInput);

    // Assemble terminal
    inputContainer.appendChild(prompt);
    inputContainer.appendChild(input);
    terminal.appendChild(output);
    terminal.appendChild(inputContainer);
    document.body.appendChild(terminal);

    // Make draggable
    makeDraggable(terminal);

    // Initial messages
    addOutput("SYSTEM INITIALIZED");
    addOutput("THE SPECTRAL PLACE v1.0 ONLINE");
    addOutput("Type 'help' for commands");

    // Focus input
    setTimeout(() => input?.focus(), 100);
}

function handleCommandInput(event: KeyboardEvent) {
    if (event.key === "Enter" && input?.value.trim()) {
        const commandText = input.value.trim();
        input.value = "";

        // Add command to output
        addOutput(`> ${commandText}`);

        // Process command
        const [command, ...args] = commandText.split(" ");
        const handler = COMMANDS[command as keyof typeof COMMANDS];

        if (handler) {
            if (typeof handler === "function") {
                try {
                    addOutput(handler(args.join(" ")));
                } catch (e) {
                    addOutput(`Error: ${e}`);
                }
            } else {
                addOutput(handler);
            }
        } else {
            addOutput(`Unknown command: ${command}`);
        }
    }
}

function addOutput(text: string) {
    if (!output) return;

    const line = document.createElement("div");
    line.textContent = text;
    output.appendChild(line);

    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
}

function updateTerminalTheme() {
    if (!terminal) return;

    switch (settings.store.terminalTheme) {
        case "AMBER":
            terminal.style.color = COLORS.RETRO_AMBER;
            terminal.style.textShadow = `0 0 5px ${COLORS.RETRO_AMBER}`;
            break;
        case "GREEN":
            terminal.style.color = COLORS.RETRO_GREEN;
            terminal.style.textShadow = `0 0 5px ${COLORS.RETRO_GREEN}`;
            break;
        case "BLUE":
            terminal.style.color = "#00a2ff";
            terminal.style.textShadow = "0 0 5px #00a2ff";
            break;
    }
}

export function stop() {
    if (terminal && terminal.parentNode) {
        terminal.parentNode.removeChild(terminal);
        terminal = null;
        input = null;
        output = null;
    }
}
