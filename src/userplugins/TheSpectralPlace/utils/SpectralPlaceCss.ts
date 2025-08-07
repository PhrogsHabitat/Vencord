/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ASSETS, COLORS } from "./Constants";
const spectralPlaceCss = `
/**
 * @name The Spectral Place - Steampunk Edition
 * @author PhrogsHabitat
 * @authorId 788145360429252610
 * @version 2.0.0
 * @description Clean, performance-optimized steampunk theme for Discord
 * @source https://github.com/PhrogsHabitat/TheSpectralPlace
 */
@import url(https://plusinsta.github.io/discord-plus/src/DiscordPlus-source.theme.css);

/* Clean Steampunk Theme Variables */

.theme-dark {
  /* Steampunk Backdrop */
  --dplus-backdrop: url(Nun);

  /* Clean Steampunk Color Palette */
  --spectral-brass: ${COLORS.BRASS};
  --spectral-copper: ${COLORS.COPPER};
  --spectral-bronze: ${COLORS.BRONZE};
  --spectral-steel: ${COLORS.STEEL};
  --spectral-wood: ${COLORS.DARK_WOOD};
  --spectral-leather: ${COLORS.LEATHER_BROWN};
  --spectral-retro-green: ${COLORS.RETRO_GREEN};
  --spectral-retro-amber: ${COLORS.RETRO_AMBER};

  /* Steampunk Accent Colors */
  --dplus-accent-color-hue: 38; /* Brass hue */
  --dplus-accent-color-saturation: 65%;
  --dplus-accent-color-lightness: 50%;

  /* Steampunk Foreground Colors */
  --dplus-foreground-color-hue-base: 35;
  --dplus-foreground-color-hue-links: 25;
  --dplus-foreground-color-saturation-amount: 0.6;
  --dplus-foreground-color-lightness-amount: 0.9;

  /* Steampunk Background Colors */
  --dplus-background-color-hue: 30;
  --dplus-background-color-saturation-amount: 0.4;
  --dplus-background-color-lightness-amount: 0.3;
  --dplus-background-color-alpha: 0.5;
}

.theme-light {
  /* Light Steampunk Theme */
  --dplus-backdrop: url(Nun);

  /* Light Theme Steampunk Colors */
  --spectral-brass: ${COLORS.BRASS_LIGHT};
  --spectral-copper: ${COLORS.COPPER_LIGHT};
  --spectral-bronze: ${COLORS.BRONZE_LIGHT};
  --spectral-steel: ${COLORS.STEEL_LIGHT};
  --spectral-wood: ${COLORS.AGED_WOOD};
  --spectral-leather: ${COLORS.LEATHER_TAN};
  --spectral-retro-green: ${COLORS.GREEN_GLASS};
  --spectral-retro-amber: ${COLORS.CATHODE_AMBER};

  /* Light Theme Accent Colors */
  --dplus-accent-color-hue: 42;
  --dplus-accent-color-saturation: 70%;
  --dplus-accent-color-lightness: 55%;

  /* Light Theme Foreground Colors */
  --dplus-foreground-color-hue-base: 35;
  --dplus-foreground-color-hue-links: 25;
  --dplus-foreground-color-saturation-amount: 0.5;
  --dplus-foreground-color-lightness-amount: 0.25;

  /* Light Theme Background Colors */
  --dplus-background-color-hue: 40;
  --dplus-background-color-saturation-amount: 0.3;
  --dplus-background-color-lightness-amount: 0.9;
  --dplus-background-color-alpha: 0.7;
}


:root {
  /* Clean Steampunk Typography */
  --dplus-font-ui: 'Press Start 2P', monospace;
  --dplus-font-body: 'Press Start 2P', monospace;
  --dplus-font-header: 'Press Start 2P', monospace;

  /* Subtle Corner Radii */
  --dplus-radius-ui: 4px !important;
  --dplus-radius-avatar: 6px !important;
  --dplus-radius-server: 4px !important;

  /* Standard Spacing */
  --dplus-spacing-ui: 20px;
  --dplus-spacing-app: 10px;

  /* Icon Sizes */
  --dplus-icon-avatar-chat: 64px;
  --dplus-icon-avatar-list: 32px;
  --dplus-icon-avatar-profile: 80px;
  --dplus-icon-server-sidebar: 48px;
  --dplus-icon-server-list: 32px;

  /* Home icon paths */
  --dplus-icon-home-dark: url(C:/Users/Sean/Desktop/Youtube/Assets/Images/FNF/PhrogInside.png);
  --dplus-icon-home-light: url(C:/Users/Sean/Desktop/Youtube/Assets/Images/FNF/PhrogInside.png);

  /* Clean UI Variables */
  --dplus-scrollbar-width: 16px;
  --dplus-bgc-chatmsg: rgba(58, 46, 30, 0.6);
  --dplus-bgc-ui-card: rgba(75, 60, 40, 0.5);
  --dplus-bgc-chatmsg-hover: rgba(96, 76, 50, 0.7);
  --dplus-bgc-ui-base: rgba(45, 35, 25, 0.6);

  /* Optimized Animation Timings */
  --dplus-anim-long: 0.3s;
  --dplus-anim-short: 0.15s;
}

/* Simplified Steampunk Message Styling */
.cozy_c19a55 .message__5126c {
    padding-left: calc(var(--dplus-icon-avatar-chat) + var(--dplus-spacing-ui) * 2);
    background: rgba(184, 140, 79, 0.1);
    border: 1px solid var(--spectral-brass-dark);
    border-radius: var(--spectral-radius-panel);
    margin: 2px 0;
}

/* Subtle hover effect for messages */
.cozy_c19a55 .message__5126c:hover {
    background: rgba(197, 90, 17, 0.15);
    border-color: var(--spectral-copper);
}

/* Simplified Steampunk Avatar Styling */
.avatar_c19a55 {
  transform: translateY(-10px);
  border: 2px solid var(--spectral-brass);
  border-radius: var(--dplus-radius-avatar);
  transition: border-color var(--dplus-anim-short) ease-out;
}

.avatar_c19a55:hover {
  border-color: var(--spectral-copper);
}

/* Sets the bottom section of the USERINFO pannel to invisible
	-> TO DO: Tint the background slightly to represent the Users selected color
	   so that it's not completely discarded.
 */
*[style*="rgba("]:not(.messageContent_f9f2ca):not(.markup_f8f345) {
  background: rgba(0, 0, 0, 0.5);
}

/* Simplified Steampunk Sidebar Styling */
.itemsContainer_ef3116{
  transform: translateY(2%);
  background: rgba(58, 46, 30, 0.3);
  border: 1px solid var(--spectral-brass-dark);
  border-radius: var(--spectral-radius-panel);
}

/* Simplified User Info Panel */
.none_d125d2{
  background: rgba(150, 75, 0, 0.2);
  border: 1px solid var(--spectral-copper-dark);
  border-radius: var(--spectral-radius-panel);
}

/* Simplified Sidebar Container */
.sidebar_c48ade{
  background: rgba(58, 46, 30, 0.2) !important;
  border-right: 1px solid var(--spectral-steel);
}

/* Simplified Channel Header */
.subtitleContainer_f75fb0{
  background: rgba(184, 140, 79, 0.3);
  border: 1px solid var(--spectral-brass-dark);
  border-radius: var(--spectral-radius-panel);
}

/* MESSAGES -> In currently selected channel */
.form_f75fb0, .visual-refresh .form_f75fb0 {
	border-top: none;
	box-shadow: none;
	margin: 0;
	margin-right: var(--dplus-scrollbar-width);
	display: flex;
	padding: 0;
	flex-direction: column-reverse;
}
/* Profiles that have an Avatar Decoration, we have to treat differently
   since the decoration assumes the avatar is square */
.avatarDecoration_c19a55 {
	transform: translateY(-10px) scale(1.04);
}
.message__5126c:has(.avatarDecoration_c19a55){
	.avatar_c19a55{
		border-radius: 50px !important;
		transform: scale(1.08) translateY(-10px);
	}
}


.visual-refresh-chat-input .channelBottomBarArea_f75fb0 {margin: 0;}
.visual-refresh .channelTextArea_f75fb0 {background-color: var(--dplus-bgc-chatmsg);}
.sansAttachButton__74017 {
	padding: calc(2px + (var(--dplus-spacing-ui) / 2));
	padding-top: calc(2px + (var(--dplus-spacing-ui) / 8));
	padding-bottom: calc(2px + (var(--dplus-spacing-ui) / 8));
}
.channelTextArea__74017 {
	padding-top: 24px;
	background-color: transparent;
	margin-top: var(--dplus-spacing-app) !important;
	margin: var(--dplus-spacing-ui) 0 0;
}
:root:not(.reduce-motion) .channelBottomBarArea_f75fb0:not(:has(~ .base_b88801)) .channelTextArea_f75fb0 {
	padding-top: 0px;
	transition-property: padding-top;
	transition-duration: var(--dplus-anim-long);
	transition-delay: var(--dplus-anim-long);
}
:root:not(.reduce-motion) .channelTextAreaContainer_d0696b:has(~ .base_b88801) { /*undone*/
	padding-top: 24px;
	transition-property: padding-top;
	transition-duration: var(--dplus-anim-short);
}
.wrapper__44df5 {
	height: 12px;
	background: var(--dplus-bgc-ui-card);
	margin-top: var(--dplus-spacing-app);
	margin-bottom: 0;
	border-radius: var(--dplus-radius-ui);
}
.base_b88801 {
	top: calc(var(--dplus-spacing-app) / 2);
}
.typingDots_b88801, .cooldownWrapper_b21699 {
	background: var(--dplus-bgc-ui-card);
	border-radius: var(--dplus-radius-ui);
	padding-right: 0.25rem;
}
/* Enhanced Steampunk Chat Input */
.scrollableContainer__74017 {
  overflow-y: auto;
  background: var(--spectral-brass-gradient);
  border: var(--spectral-border-brass);
  border-radius: var(--spectral-radius-button);
  box-shadow: var(--spectral-shadow-inset), var(--spectral-shadow-brass);
  position: relative;
}

/* Add mechanical texture to chat input */
.scrollableContainer__74017::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background:
    linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%),
    repeating-linear-gradient(45deg, transparent 0px, rgba(0,0,0,0.05) 1px, transparent 3px);
  border-radius: calc(var(--spectral-radius-button) - 2px);
  pointer-events: none;
}

/* Steampunk chat input focus effect */
.scrollableContainer__74017:focus-within {
  border-color: var(--spectral-copper);
  box-shadow:
    var(--spectral-shadow-inset),
    var(--spectral-shadow-copper),
    0 0 15px var(--spectral-copper);
  background: var(--spectral-copper-gradient);
}
.form_f75fb0:before, .form_f75fb0:after {
	display: none;
} /* Random gradient apparently? */
.webkit__8d35a .buttons__74017 {
	margin-right: calc(var(--dplus-spacing-ui) - 6px);
}
.stackedBars__74017 + .scrollableContainer__74017 {
	border-radius: 0 0 var(--dplus-radius-ui) var(--dplus-radius-ui);
}
.channelAppLauncher_e6e74f {
  margin-bottom: calc(var(--dplus-spacing-ui) / 2);
  & .button_e6e74f {background-color: var(--dplus-bgc-chatmsg);}
}

#app-mount .chat_f75fb0 {
	background: transparent;
	border-radius: var(--dplus-radius-ui);
}
.chatContent_f75fb0, .form_f75fb0:before, .replying__5126c:before {
	background: transparent !important;
}
.wrapper_fc8177, #app-mount .children__9293f:after {display: none;}
.group-spacing-0 { --group-spacing: 0px; }
.group-spacing-4 { --group-spacing: 4px; }
.group-spacing-8 { --group-spacing: 8px; }
.group-spacing-16 { --group-spacing: 16px; }
.group-spacing-24 { --group-spacing: var(--dplus-spacing-ui); }
:is(.messageListItem__5126c, .quotedChatMessage__5126c) .message__5126c {
	background: var(--dplus-bgc-chatmsg);
	margin-right: 1%;
}

.messageListItem__5126c .groupStart__5126c, .flash__03436.groupStart__5126c, .quotedChatMessage__5126c .groupStart__5126c {
	border-radius: var(--dplus-radius-ui) var(--dplus-radius-ui) 0 0;
	margin-top: 0;

}
:not(.divider__5126c) + .messageListItem__5126c:has(.groupStart__5126c), .messageListItem__5126c + .flash__03436:has(.avatar_c19a55) {
	margin-top: var(--group-spacing);
}
.wrapper_c19a55:hover, .wrapper_c19a55.selected__5126c {
	background: var(--dplus-bgc-chatmsg-hover) !important;
}
.scrollerSpacer__36d07 { height: 0; }
.wrapper_c19a55.cozy_c19a55.zalgo_c19a55[aria-labelledby*="upload"] {background-color: var(--dplus-bgc-chatmsg);}
.cozy_c19a55 .repliedMessage_c19a55 {max-width: 100%;}
/* Beginning of chat */
.container__00de6 {
	background: var(--dplus-bgc-chatmsg);
	border-radius: 0 0 var(--dplus-radius-ui) var(--dplus-radius-ui);
	margin: 0;
	padding: var(--dplus-spacing-ui);
}
.container__9293f.themed__9293f {
	background: var(--dplus-bgc-ui-base);
}
.container__34c2c { /* Forum specific; reactions, following, copy link */
	margin-top: 0px;
	border-top: none;
}
.empty__36d07, .emptyForum__36d07 { /* Spacing at the bottom */
	display: none;
}
/* New/Old/Load messages bar */
.newMessagesBar__0f481 {
	background-color: var(--dplus-accent-ui) !important;
	border-radius: 0 0 var(--dplus-radius-ui) var(--dplus-radius-ui) !important;
	width: 100%;
}
.newMessagesBar__0f481 button:last-child {
	font-size: 12px;
	text-transform: lowercase;
}
.barBase__0f481 {
	padding: 0;
	left: 0; right: 0;
}
#app-mount .jumpToPresentBar__0f481 {
	background-color: var(--dplus-accent-ui);
	border-radius: var(--dplus-radius-ui) var(--dplus-radius-ui) 0 0;
	bottom: 0;
	padding: 0;
	cursor: pointer;
	z-index: 2;
}
/*- Stupid Message Seperation Shit -*/
:is(.messageListItem__5126c, .quotedChatMessage__5126c, .flash__03436):has(+ .messageListItem__5126c .groupStart__5126c,  + .flash__03436 .groupStart__5126c, + .scrollerSpacer__36d07, + .divider__5126c) .groupStart__5126c:has(.avatar_c19a55:not(.compact_c19a55)) 	{
	min-height: calc(var(--dplus-spacing-ui)*2 + var(--dplus-icon-avatar-chat));
	padding-top: 0; padding-bottom: 0;
}
.cozy_c19a55.wrapper_c19a55 {padding-left: calc(var(--dplus-icon-avatar-chat) + var(--dplus-spacing-ui) * 2);}
.groupStart__5126c,
.divider__5126c + :is(.messageListItem__5126c, .flash__03436) .message__5126c {
	border-radius: var(--dplus-radius-ui) var(--dplus-radius-ui) 0 0;
}
:is(.messageListItem__5126c,.flash__03436):has(+ .messageListItem__5126c .groupStart__5126c, + .divider__5126c, + .scrollerSpacer__36d07, + .flash__03436 .groupStart__5126c) .message__5126c {
	border-radius: 0 0 var(--dplus-radius-ui) var(--dplus-radius-ui);
}
:is(.messageListItem__5126c,.flash__03436):has( + .messageListItem__5126c .groupStart__5126c, + .divider__5126c, + .scrollerSpacer__36d07, + .flash__03436 .groupStart__5126c) .groupStart__5126c,
.divider__5126c + :is(.messageListItem__5126c, .flash__03436):has(+ .messageListItem__5126c .groupStart__5126c) .message__5126c {
	border-radius: var(--dplus-radius-ui);
}
/* Forum */
.container__01ae2:not(.floating__01ae2), .visual-refresh .container_f369db, .form_d9be46 .input__0f084 {
	background-color: transparent!important;
}
.floating__01ae2 {filter: none;}

/* group-spacing 0 */
.group-spacing-0 .message__5126c {
border-radius: 0!important;
}
.group-spacing-0 .messageListItem__5126c:has(+ .scrollerSpacer__36d07) .message__5126c {
border-radius: 0 0 var(--dplus-radius-ui) var(--dplus-radius-ui)!important;
}

/* Enhanced Steampunk Scrollbars */
.theme-dark ::-webkit-scrollbar-track-piece,
.theme-dark .theme-light ::-webkit-scrollbar-track-piece,
.theme-light .theme-dark ::-webkit-scrollbar-track-piece {
  background: var(--spectral-wood-gradient) !important;
  border: 1px solid var(--spectral-brass-dark) !important;
  border-radius: var(--spectral-radius-button);
}

.theme-light ::-webkit-scrollbar-track-piece {
  background: var(--spectral-leather-gradient) !important;
  border: 1px solid var(--spectral-copper-dark) !important;
}

::-webkit-scrollbar-thumb {
  background: var(--spectral-brass-gradient) !important;
  border: 2px solid var(--spectral-brass-dark) !important;
  border-radius: var(--spectral-radius-button);
  box-shadow: var(--spectral-shadow-brass);
  position: relative;
}

/* Add rivet texture to scrollbar thumb */
::-webkit-scrollbar-thumb:hover {
  background: var(--spectral-copper-gradient) !important;
  border-color: var(--spectral-copper-dark) !important;
  box-shadow: var(--spectral-shadow-copper);
}

::-webkit-scrollbar-thumb:active {
  background: var(--spectral-bronze-gradient) !important;
  box-shadow: var(--spectral-shadow-inset);
}

::-webkit-scrollbar {
  width: var(--dplus-scrollbar-width) !important;
  background: var(--spectral-dark-wood);
  border-radius: var(--spectral-radius-button);
}

::-webkit-scrollbar-track {
  background: var(--spectral-wood-gradient) !important;
  border: 1px solid var(--spectral-steel) !important;
  border-radius: var(--spectral-radius-button);
  box-shadow: var(--spectral-shadow-inset);
}

/* Add corner decoration to scrollbar */
::-webkit-scrollbar-corner {
  background: var(--spectral-brass-gradient);
  border: 1px solid var(--spectral-brass-dark);
}

.scroller_ef3116::-webkit-scrollbar {width: 0!important;}

/* Now, time for a bunch of SideBar tweaks and shit */

  /*- General Sidebar -*/
.sidebar_c48ade,
.bannerImage_f37cb1 {
	width: var(--dplus-channels-width);
}
.sidebar_c48ade {
	background: var(--dplus-bgc-ui-base);
	border-radius: var(--dplus-radius-ui) !important;
	margin-right: var(--dplus-spacing-app);
}
.visual-refresh .sidebarList_c48ade {
	margin-bottom: calc(var(--custom-app-panels-height, 0) + var(--dplus-spacing-ui) );
	border-radius: var(--dplus-radius-ui) !important;
}
.visual-refresh .sidebar_c48ade:after{display: none;}

 /*- DM Sidebar -*/
.scrollerBase__99f8c, .privateChannels__35e86, .sidebarList_c48ade,.sidebarListRounded_c48ade {
  background-color: rgba(58, 46, 30, 0.4) !important;
}

[class*="panels"], [class*="card"] {
  background-color: rgba(58, 46, 30, 0.6) !important;
  border: 1px solid var(--spectral-brass-dark);
}

.visual-refresh .scroller__99e7c {margin-bottom: 0;}
.privateChannels__35e86 .channel__972a0 {
	margin-left: var(--dplus-spacing-ui);
	margin-right: var(--dplus-spacing-ui);
}
.closeButton__972a0 {
	display: block;
	opacity: 0;
	margin-right: calc(var(--dplus-spacing-ui) - var(--dplus-spacing-ui) * 1.5);
	transition: var(--dplus-anim-button-appear);
}
.channel__972a0:hover .closeButton__972a0 {
	opacity: 0.6;
	margin-right: 0;
}
	/*- Server Sidebar -*/
#app-mount .container__2637a, .container__551b0,  .visual-refresh #app-mount .header_f37cb1, .visual-refresh .clickable_f37cb1  {
	background-color: transparent;
}
.visual-refresh .container__2637a {padding-bottom: 0;}
/*unread bar*/
.visual-refresh .bottom__7aaec {bottom: 0;}
/* Animated channel buttons */
.iconItem_c69b6d {display: block !important;}
.iconVisibility_c69b6d .children__2ea32 {
	margin-right: calc(0px - var(--dplus-spacing-ui));
}
.containerDefault_c69b6d.selected_c69b6d .children__2ea32,
.iconVisibility_c69b6d:hover .children__2ea32 {
margin-right: 0;
}
.iconVisibility_c69b6d .children__2ea32 [role="button"] {
	width: 0;
	opacity: 0;
}
.containerDefault_c69b6d.selected_c69b6d .children__2ea32 [role="button"], .iconVisibility_c69b6d:hover .children__2ea32 [role="button"] {
	width: fit-content	;
	opacity: 1;
}
.iconVisibility_c69b6d :is(.children__2ea32, .iconItem_c69b6d, .channelInfo_c69b6d),
.iconVisibility_c69b6d:hover .wrapper__260e1 {
	transition-duration: var(--dplus-anim-button-appear);
}
	/*-- 11.4 User Area (visual refresh) --*/
.visual-refresh .panels_c48ade {
	background: var(--dplus-bgc-ui-base);
	width: 100%;
	left: 0; bottom: 0;
}

.standardSidebarView__23e6b {
	bottom: -50px;
}

.form_f75fb0, .visual-refresh .form_f75fb0 {
	border-top: none;
	box-shadow: none;
	margin: 0;
	margin-right: var(--dplus-scrollbar-width);
	display: flex;
	padding: 0;
	flex-direction: column-reverse;
}
.visual-refresh-chat-input .channelBottomBarArea_f75fb0 {margin: 0;}
.visual-refresh .channelTextArea_f75fb0 {background-color: var(--dplus-bgc-chatmsg);}
.sansAttachButton__74017 {
	padding: calc(2px + (var(--dplus-spacing-ui) / 2));
	padding-top: calc(2px + (var(--dplus-spacing-ui) / 8));
	padding-bottom: calc(2px + (var(--dplus-spacing-ui) / 8));
}
.channelTextArea__74017 {
	padding-top: 24px;
	background-color: transparent;
	margin-top: var(--dplus-spacing-app) !important;
	margin: var(--dplus-spacing-ui) 0 0;
}
:root:not(.reduce-motion) .channelBottomBarArea_f75fb0:not(:has(~ .base_b88801)) .channelTextArea_f75fb0 {
	padding-top: 0px;
	transition-property: padding-top;
	transition-duration: var(--dplus-anim-long);
	transition-delay: var(--dplus-anim-long);
}
:root:not(.reduce-motion) .channelTextAreaContainer_d0696b:has(~ .base_b88801) { /*undone*/
	padding-top: 24px;
	transition-property: padding-top;
	transition-duration: var(--dplus-anim-short);
}
.wrapper__44df5 {
	height: 12px;
	background: var(--dplus-bgc-ui-card);
	margin-top: var(--dplus-spacing-app);
	margin-bottom: 0;
	border-radius: var(--dplus-radius-ui);
}
.base_b88801 {
	top: calc(var(--dplus-spacing-app) / 2);
}
.typingDots_b88801, .cooldownWrapper_b21699 {
	background: var(--dplus-bgc-ui-card);
	border-radius: var(--dplus-radius-ui);
	padding-right: 0.25rem;
}
.scrollableContainer__74017 {
	overflow-y: auto;
	background-color: var(--dplus-bgc-chatmsg);
	border-radius: var(--dplus-radius-ui);
}
.form_f75fb0:before, .form_f75fb0:after {
	display: none;
} /* Random gradient? Does this do anything? */
.webkit__8d35a .buttons__74017 {
	margin-right: calc(var(--dplus-spacing-ui) - 6px);
}
.stackedBars__74017 + .scrollableContainer__74017 {
	border-radius: 0 0 var(--dplus-radius-ui) var(--dplus-radius-ui);
}
.channelAppLauncher_e6e74f {
  margin-bottom: calc(var(--dplus-spacing-ui) / 2);
  & .button_e6e74f {background-color: var(--dplus-bgc-chatmsg);}
}

/* :is(.messageListItem__5126c, .quotedChatMessage__5126c) .message__5126c {
	background-color: rgba(0, 0, 0, 0.692) !important;
  backdrop-filter: blur(7px) opacity(0.7) saturate(25);
  -webkit-backdrop-filter: blur(7px) opacity(0.3) saturate(25);
} */

/* .messageListItem__5126c .groupStart__5126c, .flash__03436.groupStart__5126c, .quotedChatMessage__5126c .groupStart__5126c {
	border-radius: var(--dplus-radius-ui) var(--dplus-radius-ui) 0 0;
	margin-top: 0;
	position: relative;
	z-index: 9999999;
	background-color: rgba(0, 0, 0, 0.692) !important;
}
:is(.messageListItem__5126c, .quotedChatMessage__5126c) .message__5126c {
	background: var(--dplus-bgc-chatmsg);
	background-color: rgba(0, 0, 0, 0.692) !important;
	padding-top: 0px;
	padding-bottom: 10px;
	-webkit-background-composite: padding;

}

:not(.divider__5126c) + .messageListItem__5126c:has(.groupStart__5126c), .messageListItem__5126c + .flash__03436:has(.avatar_c19a55) {
	margin-top: var(--group-spacing);
	position: relative;
	z-index: 9999999;
} */

.scrollerSpacer__36d07 { height: 0; }
.wrapper_c19a55.cozy_c19a55.zalgo_c19a55[aria-labelledby*="upload"] {
	background-color: rgba(0, 0, 0, 0.692) !important;
}
.cozy_c19a55 .repliedMessage_c19a55 {max-width: 100%;}

/* Cool Spectral Stuff heheheehehehehehehe */

/* Base SteamPunk Background */
.spectral-place-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        135deg,
        ${COLORS.DARK_WOOD} 0%,
        ${COLORS.COPPER} 50%,
        ${COLORS.BRASS} 100%
    );
    z-index: -100;
    overflow: hidden;
}

/* CRT Scanline Effect */
.crt-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('${ASSETS.CRT_OVERLAY}');
    opacity: 0.1;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: overlay;
}

/* Terminal Display */
.terminal-display {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 150px;
    background-color: rgba(0, 0, 0, 0.7);
    border: 2px solid ${COLORS.BRASS};
    border-radius: 4px;
    padding: 10px;
    font-family: 'Courier New', monospace;
    color: ${COLORS.RETRO_GREEN};
    text-shadow: 0 0 5px ${COLORS.RETRO_GREEN};
    overflow: hidden;
    z-index: 1000;
}

/* Quick Actions Panel */
.spectral-quick-actions {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(58, 46, 30, 0.8);
    border: 1px solid ${COLORS.BRASS};
    border-radius: 5px;
    padding: 10px;
    z-index: 1000;
}

/* Here we will RE-Apply some styles that Discord+ sets, because we wanna override them*/
/* Chances are, these already exist somewhere in this file but I don't care, I'm lazy */

/* Enhanced Steampunk Typography System */

/* Import Google Fonts for steampunk aesthetics */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

/* Main UI Elements - Industrial Serif */
.containerDefault-7RImuF,
.title-38psAC,
.header-3Uvj1Y,
.labelText-18WuF7 {
  font-family: 'Cinzel', 'Press Start 2P', serif !important;
  font-weight: 600;
  line-height: 1.2;
  text-shadow:
    1px 1px 2px rgba(0,0,0,0.8),
    0 0 5px var(--spectral-brass);
  letter-spacing: 0.5px;
}

/* Headers and Titles - Elegant Victorian */
h1, h2, h3, h4, h5, h6,
.header-3Uvj1Y,
.title-38psAC,
.channelName-3KPsGw {
  font-family: 'Playfair Display', 'Cinzel', serif !important;
  font-weight: 700;
  color: var(--spectral-brass-light);
  text-shadow:
    2px 2px 4px rgba(0,0,0,0.9),
    0 0 10px var(--spectral-brass),
    0 0 20px var(--spectral-brass);
  letter-spacing: 1px;
  position: relative;
}

/* Add decorative underline to headers */
h1::after, h2::after, h3::after,
.header-3Uvj1Y::after,
.title-38psAC::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--spectral-brass), var(--spectral-copper), var(--spectral-brass));
  border-radius: 1px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

/* Body Text - Readable Vintage */
.messageContent-2t3eCI,
.markup-eYLPri,
.text-sm-normal-AEQz4v,
.text-md-normal-2rFCH3 {
  font-family: 'Crimson Text', 'Libre Baskerville', serif !important;
  font-size: 15px;
  line-height: 1.5;
  color: var(--spectral-aged-wood);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

/* Monospace Text - Mechanical/Technical */
code,
.codeBlockText-28BOxV,
.inlineCode-ERyvy_,
.terminal-display {
  font-family: 'Courier New', 'Press Start 2P', monospace !important;
  background: var(--spectral-dark-wood);
  color: var(--spectral-retro-green);
  border: 1px solid var(--spectral-brass-dark);
  border-radius: var(--spectral-radius-button);
  padding: 2px 6px;
  text-shadow: 0 0 5px currentColor;
  box-shadow: var(--spectral-shadow-inset);
}

/* Username Styling - Brass Nameplate Effect */
.username-h_Y3Us,
.author-2Y3ZuT {
  font-family: 'Cinzel', serif !important;
  font-weight: 600;
  color: var(--spectral-brass-light);
  text-shadow:
    1px 1px 2px rgba(0,0,0,0.8),
    0 0 8px var(--spectral-brass);
  position: relative;
  padding: 2px 8px;
  background: linear-gradient(135deg, var(--spectral-brass-dark), var(--spectral-brass));
  border-radius: var(--spectral-radius-button);
  border: 1px solid var(--spectral-brass-light);
  box-shadow: var(--spectral-shadow-brass);
}

/* Add nameplate rivets */
.username-h_Y3Us::before,
.author-2Y3ZuT::before {
  content: '• •';
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  color: var(--spectral-brass-light);
  letter-spacing: 2px;
}

.username-h_Y3Us::after,
.author-2Y3ZuT::after {
  content: '• •';
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  color: var(--spectral-brass-light);
  letter-spacing: 2px;
}

/* Force blocky UI */
.containerDefault-7RImuF,
.modal-3PAGxG,
.button-38aScr,
.popout-1i2qxc {
  border-radius: 0 !important;
  border: 2px solid #666 !important;
}

/* Ensure that messages have zero-blur policy to keep crisp edges */
.message-3amgkF,
.popout-1i2qxc,
.modal-3PAGxG {
  box-shadow:
    0 0 0 2px #000, /* outline */
    4px 4px 0 0 rgba(0,0,0,0.5); /* pixel drop-shadow */
}

/* Additional Steampunk Typography Elements */

/* Timestamps - Vintage Clock Style */
.timestamp-p1Df1m,
.timestampInline-_lS3aK {
  font-family: 'Courier New', monospace !important;
  font-size: 11px;
  color: var(--spectral-copper-dark);
  background: var(--spectral-dark-wood);
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid var(--spectral-copper-dark);
  text-shadow: 0 0 3px var(--spectral-copper);
  box-shadow: var(--spectral-shadow-inset);
}

/* Links - Brass Mechanical Style */
a, .anchor-1MIwyf,
.link-1_kTxV {
  color: var(--spectral-brass-light) !important;
  font-weight: 600;
  text-decoration: none;
  text-shadow: 0 0 5px var(--spectral-brass);
  border-bottom: 1px dotted var(--spectral-brass);
  transition: all var(--dplus-anim-short) ease-out;
}

a:hover, .anchor-1MIwyf:hover,
.link-1_kTxV:hover {
  color: var(--spectral-copper-light) !important;
  text-shadow: 0 0 8px var(--spectral-copper);
  border-bottom-color: var(--spectral-copper);
  transform: translateY(-1px);
}

/* Mentions - Brass Tag Style */
.mention-3XBnnZ {
  background: var(--spectral-brass-gradient) !important;
  color: var(--spectral-dark-wood) !important;
  border: 1px solid var(--spectral-brass-dark);
  border-radius: var(--spectral-radius-button);
  padding: 2px 6px;
  font-family: 'Cinzel', serif !important;
  font-weight: 600;
  text-shadow: none;
  box-shadow: var(--spectral-shadow-brass);
}

.mention-3XBnnZ:hover {
  background: var(--spectral-copper-gradient) !important;
  border-color: var(--spectral-copper-dark);
  box-shadow: var(--spectral-shadow-copper);
}

/* Reactions - Steampunk Badges */
.reaction-3vwAF2 {
  background: var(--spectral-brass-gradient);
  border: 1px solid var(--spectral-brass-dark);
  border-radius: var(--spectral-radius-button);
  box-shadow: var(--spectral-shadow-brass);
  font-family: 'Cinzel', serif;
  font-weight: 500;
}

.reaction-3vwAF2:hover {
  background: var(--spectral-copper-gradient);
  border-color: var(--spectral-copper-dark);
  box-shadow: var(--spectral-shadow-copper);
  transform: translateY(-1px);
}

/* Status Text - Industrial Labels */
.status-2xYiEu,
.activityText-1rR-8O {
  font-family: 'Courier New', monospace !important;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--spectral-steel);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

/* Enhanced Text Shadow for Headers */
.labelText-18WuF7,
.header-3Uvj1Y {
  text-shadow:
    2px 2px 4px rgba(0,0,0,0.9),
    0 0 10px var(--spectral-brass),
    0 0 20px var(--spectral-brass);
}

/* Enhanced Steampunk Button Styling */
.button-38aScr.lookFilled-1Gx00P {
  background: var(--spectral-brass-gradient) !important;
  color: var(--spectral-dark-wood) !important;
  border: var(--spectral-border-brass) !important;
  border-radius: var(--spectral-radius-button) !important;
  position: relative;
  box-shadow: var(--spectral-shadow-brass);
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  transition: all var(--dplus-anim-short) ease-out;
  overflow: hidden;
}

/* Add brass rivet decoration to buttons */
.button-38aScr.lookFilled-1Gx00P::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  border: 1px solid var(--spectral-brass-light);
  border-radius: calc(var(--spectral-radius-button) - 2px);
  background:
    radial-gradient(circle at 8px 8px, var(--spectral-brass-light) 2px, transparent 2px),
    radial-gradient(circle at calc(100% - 8px) 8px, var(--spectral-brass-light) 2px, transparent 2px),
    radial-gradient(circle at 8px calc(100% - 8px), var(--spectral-brass-light) 2px, transparent 2px),
    radial-gradient(circle at calc(100% - 8px) calc(100% - 8px), var(--spectral-brass-light) 2px, transparent 2px);
  pointer-events: none;
  opacity: 0.6;
}

.button-38aScr.lookFilled-1Gx00P:hover {
  background: var(--spectral-copper-gradient) !important;
  border-color: var(--spectral-copper) !important;
  box-shadow: var(--spectral-shadow-copper), var(--spectral-shadow-glow);
  transform: translateY(-1px);
}

.button-38aScr.lookFilled-1Gx00P:active {
  transform: translateY(1px);
  box-shadow: var(--spectral-shadow-inset);
  background: var(--spectral-bronze-gradient) !important;
}

/* Enhanced Steampunk Modals and Popups */
.popout-1i2qxc,
.popover-3baos1,
.card-1Xbug9,
.containerDefault-7RImuF {
  background: var(--spectral-brass-gradient) !important;
  border: var(--spectral-border-brass) !important;
  border-radius: var(--spectral-radius-panel) !important;
  box-shadow: var(--spectral-shadow-raised), var(--spectral-shadow-brass) !important;
  position: relative;
  overflow: hidden;
}

/* Add steampunk frame decoration to modals */
.popout-1i2qxc::before,
.popover-3baos1::before,
.card-1Xbug9::before,
.containerDefault-7RImuF::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 2px solid var(--spectral-brass-light);
  border-radius: calc(var(--spectral-radius-panel) - 6px);
  background:
    radial-gradient(circle at 12px 12px, var(--spectral-brass-light) 3px, transparent 3px),
    radial-gradient(circle at calc(100% - 12px) 12px, var(--spectral-brass-light) 3px, transparent 3px),
    radial-gradient(circle at 12px calc(100% - 12px), var(--spectral-brass-light) 3px, transparent 3px),
    radial-gradient(circle at calc(100% - 12px) calc(100% - 12px), var(--spectral-brass-light) 3px, transparent 3px);
  pointer-events: none;
  opacity: 0.7;
  z-index: 1;
}

/* Add corner gears to large modals */
.modal-3PAGxG {
  background: var(--spectral-wood-gradient) !important;
  border: 3px solid var(--spectral-brass) !important;
  border-radius: var(--spectral-radius-panel) !important;
  box-shadow: var(--spectral-shadow-raised), 0 0 30px rgba(0,0,0,0.5) !important;
}

.modal-3PAGxG::after {
  content: '⚙ ⚙ ⚙';
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 16px;
  color: var(--spectral-brass);
  animation: rotate var(--spectral-anim-gear) linear infinite;
  opacity: 0.6;
  z-index: 2;
}

/* Enhanced Steampunk Background System */
.spectral-place-background {
  background:
    radial-gradient(circle at 20% 30%, ${COLORS.BRASS}40 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, ${COLORS.COPPER}30 0%, transparent 50%),
    linear-gradient(135deg, ${COLORS.DARK_WOOD} 0%, ${COLORS.AGED_WOOD} 30%, ${COLORS.COPPER} 70%, ${COLORS.BRASS} 100%);
  position: relative;
}

/* Add industrial texture overlay */
.spectral-place-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    repeating-linear-gradient(45deg, transparent 0px, rgba(0,0,0,0.02) 1px, transparent 3px),
    repeating-linear-gradient(-45deg, transparent 0px, rgba(255,255,255,0.01) 1px, transparent 4px);
  pointer-events: none;
}

/* Enhanced CRT overlay with steampunk elements */
.crt-overlay {
  background-image: url('${ASSETS.CRT_OVERLAY}');
  background-blend-mode: overlay;
}

/* Add subtle steam animation to background */
.spectral-place-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(ellipse at 10% 100%, rgba(245,245,245,0.1) 0%, transparent 30%),
    radial-gradient(ellipse at 90% 100%, rgba(245,245,245,0.08) 0%, transparent 25%),
    radial-gradient(ellipse at 50% 100%, rgba(245,245,245,0.06) 0%, transparent 40%);
  animation: steamRise var(--spectral-anim-steam) ease-in-out infinite;
  pointer-events: none;
}

@keyframes steamRise {
  0% {
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-50px) scale(2);
    opacity: 0;
  }
}

/* Additional gear-related animations */
@keyframes gearGlow {
  0%, 100% {
    filter: drop-shadow(0 0 5px currentColor);
  }
  50% {
    filter: drop-shadow(0 0 15px currentColor);
  }
}

@keyframes mechanicalTick {
  0%, 90%, 100% { transform: scale(1); }
  5% { transform: scale(1.02); }
}

@keyframes steamTurbulence {
  0%, 100% {
    transform: translateY(0px) scaleX(1);
    filter: blur(8px);
  }
  25% {
    transform: translateY(-5px) scaleX(1.05);
    filter: blur(10px);
  }
  50% {
    transform: translateY(-8px) scaleX(0.95);
    filter: blur(12px);
  }
  75% {
    transform: translateY(-3px) scaleX(1.02);
    filter: blur(9px);
  }
}

/* ===== CLEAN STEAMPUNK ACCENTS ===== */

/* Simple steampunk accent for headers */
.header_f37cb1,
.title-38psAC,
.channelName-3KPsGw {
  border-left: 3px solid var(--spectral-brass);
  background-color: rgba(184, 140, 79, 0.1);
}

/* Subtle steampunk accent for buttons */
.button-38aScr.lookFilled-1Gx00P {
  background-color: var(--spectral-brass) !important;
  color: var(--spectral-wood) !important;
  border: 1px solid var(--spectral-copper) !important;
}

.button-38aScr.lookFilled-1Gx00P:hover {
  background-color: var(--spectral-copper) !important;
}

/* Clean steampunk scrollbar */
::-webkit-scrollbar-thumb {
  background-color: var(--spectral-brass) !important;
  border: 1px solid var(--spectral-copper) !important;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--spectral-copper) !important;
}

/* ===== ACCESSIBILITY & PERFORMANCE OPTIMIZATIONS ===== */

/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Clean focus indicators */
button:focus,
.button-38aScr:focus,
a:focus,
[role="button"]:focus {
  outline: 2px solid var(--spectral-brass) !important;
  outline-offset: 2px !important;
}

/* Clean steampunk username styling */
.username-h_Y3Us,
.author-2Y3ZuT {
  color: var(--spectral-brass);
  font-weight: 600;
}

/* Simple steampunk code styling */
code,
.codeBlockText-28BOxV,
.inlineCode-ERyvy_ {
  background-color: var(--spectral-wood);
  color: var(--spectral-retro-green);
  border: 1px solid var(--spectral-brass);
}

/* Ensure text readability */
.messageContent-2t3eCI,
.markup-eYLPri {
  color: #E8E6E3;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .message__5126c,
  .button-38aScr,
  .sidebar_c48ade {
    border: 2px solid #FFFFFF !important;
    background: #000000 !important;
    color: #FFFFFF !important;
  }
}

`;

export default spectralPlaceCss;
