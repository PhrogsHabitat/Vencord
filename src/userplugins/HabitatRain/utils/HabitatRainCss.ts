/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

const habitatRainCss = `
/**
 * @name Habitat+
 * @author PlusInsta, PhrogsHabitat
 * @authorId 309931975102300160
 * @authorLink https://plusinsta.xyz
 * @version 3.5.0
 * @description Habitat Home brought to Discord. (Modified version by PhrogsHabitat. Base version by PlusInsta and contributors.)
 * @donate https://ko-fi.com/plusinsta
 * @website https://plusinsta.github.io/discord-plus
 * @source https://github.com/PlusInsta/discord-plus
 * @updateUrl https://plusinsta.github.io/discord-plus/DiscordPlus.theme.css
 * @invite 2Jwh2nS
*/
@import url(https://plusinsta.github.io/discord-plus/src/DiscordPlus-source.theme.css);

/* Ensure the JavaScript file is loaded for the raindrop effect to work. */

/* I've commented most of these values so you can change them yourself. If you're having trouble, or you want to do more than what these values allow for, a volunteer might be able to help you in my server. */


/*
	<- MESSAGES (In currently selected channel) ->
	.scrollerBase_d125d2

	<- USER-INFO PANEL ->
	.none_d125d2

	<- SERVERLIST + USERLIST (Section containing both lists) ->
	.sidebar_c48ade

	<- HEADER (For currently selected channel) ->
	.subtitleContainer_f75fb0

	<- SERVERLIST ->
	.itemsContainer_ef3116

 */

.theme-dark {
  /* Backdrop image (unchanged, but you can replace it if desired). */
  --dplus-backdrop: url(Nun);

  /* Accent color: True green hue for highlights and accents. */
  --dplus-accent-color-hue: 120;
  --dplus-accent-color-saturation: 70%;
  --dplus-accent-color-lightness: 45%;

  /* Foreground color: Adjusted to complement green tones. */
  --dplus-foreground-color-hue-base: 120;
  --dplus-foreground-color-hue-links: 140;
  --dplus-foreground-color-saturation-amount: 0.8;
  --dplus-foreground-color-lightness-amount: 1.0;

  /* Background color: A darker green to avoid harsh contrast. */
  --dplus-background-color-hue: 120;
  --dplus-background-color-saturation-amount: 0.5;
  --dplus-background-color-lightness-amount: 0.65;
  --dplus-background-color-alpha: 0.35; /* bro I spent forever trying to figure out why things has a dark tint :skull: */

}

.theme-light {
  /* Backdrop image (unchanged). */
  --dplus-backdrop: url(Nun);

  /* Accent color: True green for light theme. */
  --dplus-accent-color-hue: 120;
  --dplus-accent-color-saturation: 70%;
  --dplus-accent-color-lightness: 50%;

  /* Foreground color: Softer green tones for readability. */
  --dplus-foreground-color-hue-base: 120;
  --dplus-foreground-color-hue-links: 140;
  --dplus-foreground-color-saturation-amount: 0.5;
  --dplus-foreground-color-lightness-amount: 0.22;

  /* Background color: A lighter green for light theme. */
  --dplus-background-color-hue: 120;
  --dplus-background-color-saturation-amount: 0.5;
  --dplus-background-color-lightness-amount: 0.22;
  /* --dplus-background-color-alpha: 0.5; */
}

:root {
  /* Fonts (unchanged). */
  --dplus-font-ui: 'OpenDyslexic';
  --dplus-font-body: 'OpenDyslexic';
  --dplus-font-header: 'OpenDyslexic';

  /* Corner radii (unchanged). */
  --dplus-radius-ui: 10px;
  --dplus-radius-avatar: 20%;
  --dplus-radius-server: 20%;

  /* Spacing (unchanged). */
  --dplus-spacing-ui: 20px;
  --dplus-spacing-app: 10px;

  /* Icon sizes (unchanged). */
  --dplus-icon-avatar-chat: 64px;
  --dplus-icon-avatar-list: 32px;
  --dplus-icon-avatar-profile: 80px;

  --dplus-icon-server-sidebar: 48px;
  --dplus-icon-server-list: 32px;

  /* Home icon paths need hosting (unchanged). */
  --dplus-icon-home-dark: url(C:/Users/Sean/Desktop/Youtube/Assets/Images/FNF/PhrogInside.png);
  --dplus-icon-home-light: url(C:/Users/Sean/Desktop/Youtube/Assets/Images/FNF/PhrogInside.png);

  /* Added variables for chat input and UI consistency */
  --dplus-scrollbar-width: 16px;
  --dplus-bgc-chatmsg: rgba(16, 36, 18, 0.65); /* Chat message background */
  --dplus-bgc-ui-card: rgba(20, 30, 20, 0.55);  /* UI card background */
  --dplus-bgc-chatmsg-hover: rgba(16, 36, 18, 0.7); /* Message hover/selected background */
  --dplus-bgc-ui-base: rgba(19, 32, 19, 0.6);       /* Base UI background for themed containers */
  --dplus-anim-long: 0.3s;
  --dplus-anim-short: 0.15s;
}

/* Ensure message text does not overlap avatar in cozy mode */
.cozy_c19a55 .message__5126c {
    padding-left: calc(var(--dplus-icon-avatar-chat) + var(--dplus-spacing-ui) * 2);
}

/* The profile pictures that appear in the messages.
	-> This is needed so that the profile pictures don't tug down the layout.
	-> Just a small fix for the way DISCORD PLUS handles avatars in messages.

	-> I also threw in a drop-shadow effect to make the avatars look more appealing lmfao
 */
.avatar_c19a55 {
  transform: translateY(-10px);
  /* Drop-shadow removed for cleaner look */
}
.avatar_c19a55:hover {
	transform: translateY(-10px) scale(0.95);
	/* Drop-shadow removed for cleaner look */
}

/* Sets the bottom section of the USERINFO pannel to invisible
	-> TO DO: Tint the background slightly to represent the Users selected color
	   so that it's not completely discarded.
 */
*[style*="rgba("]:not(.messageContent_f9f2ca):not(.markup_f8f345) {
  background: rgba(0, 0, 0, 0.5);
}

/* SERVERLIST */
.itemsContainer_ef3116{
	transform: translateY(2%);
	background: rgba(0, 0, 0, 0.0);
	backdrop-filter: opacity(0.0);
}

/* USERINFO */
.none_d125d2{
	backdrop-filter: blur(3px) opacity(0.2) saturate(25);
}

/* SERVERLIST + USERLIST -> Section containing both lists */
.sidebar_c48ade{
  background-color: rgba(0, 0, 0, 0)!important;
}

/* HEADER -> Currently selected channel */
.subtitleContainer_f75fb0{
	backdrop-filter: blur(5px) opacity(0.2) saturate(25);
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
.scrollableContainer__74017 {
	overflow-y: auto;
	background-color: var(--dplus-bgc-chatmsg);
	border-radius: var(--dplus-radius-ui);
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

/* ScrollerBars and Shit */
.theme-dark ::-webkit-scrollbar-track-piece,
.theme-dark .theme-light ::-webkit-scrollbar-track-piece,
.theme-light .theme-dark ::-webkit-scrollbar-track-piece {
	background:  hsla(0,0%,0%,0.3)!important;
}
.theme-light ::-webkit-scrollbar-track-piece {
	background:  hsla(0,0%,100%,0.3)!important;
	border: none!important;
}
::-webkit-scrollbar-thumb {
	background: var(--dplus-accent-ui)!important;
	border: none!important;
	border-radius: var(--dplus-radius-ui);

}
::-webkit-scrollbar {
	width: var(--dplus-scrollbar-width) !important;
}
::-webkit-scrollbar-track {
	background: transparent!important;
	border: none!important;
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
  background-color: rgba(0, 0, 0, 0.18) !important;
  backdrop-filter: blur(10px) opacity(0.5) saturate(25);
  -webkit-backdrop-filter: blur(10px) opacity(0.2) saturate(25);
}

[class*="panels"], [class*="card"] {
  background-color: rgba(0, 0, 0, 0.45) !important;
  backdrop-filter: blur(7px) opacity(0.5) saturate(25);
  -webkit-backdrop-filter: blur(7px) opacity(0.2) saturate(25);
  border: rgb(3, 94, 7) 1px solid;
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

/* Habitat Rain Quick Actions CSS */

.habitat-quick-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
}

.habitat-main-bubble {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--background-primary);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    cursor: move;
    z-index: 100;
    transition: transform 0.3s ease, background 0.2s ease;
}

.habitat-main-bubble:hover {
    transform: scale(1.1);
    background: var(--background-secondary);
}

.habitat-main-bubble.expanded {
    transform: scale(1.2);
}

.habitat-main-bubble.dragging {
    transform: scale(1.2);
    opacity: 0.8;
    cursor: grabbing;
}

.habitat-actions-container {
    position: absolute;
    pointer-events: none;
}

.habitat-action-bubble {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--background-primary);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    cursor: pointer;
    transform: translate(0, 0);
    pointer-events: auto;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    transition:
        transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
        opacity 0.3s ease,
        background 0.2s ease;
}

.habitat-action-control {
    display: none;
    position: absolute;
    left: 40px;
    top: 50%;
    transform: translateY(-50%);
    background: var(--background-secondary);
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: 160px;
    z-index: 5;
}

.habitat-action-label {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--header-primary);
}

.habitat-action-control input[type="range"] {
    width: 100%;
}

.habitat-toggle-switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
}

.habitat-toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.habitat-toggle-switch .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--background-modifier-accent);
    transition: .4s;
    border-radius: 20px;
}

.habitat-toggle-switch .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

.habitat-toggle-switch input:checked + .slider {
    background-color: var(--brand-experiment);
}

.habitat-toggle-switch input:checked + .slider:before {
    transform: translateX(20px);
}

@keyframes habitat-fade-in {
    from { opacity: 0; transform: translateY(-10px) translateY(-50%); }
    to { opacity: 1; transform: translateY(-50%); }
}

@keyframes habitat-fade-out {
    from { opacity: 1; transform: translateY(-50%); }
    to { opacity: 0; transform: translateY(-10px) translateY(-50%); }
}

`;

export default habitatRainCss;
