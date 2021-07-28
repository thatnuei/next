export interface BBCodeShortcut {
	type: "bbcode"
	key: string
	tag: string
	hasValue?: boolean
}

export const shortcuts: BBCodeShortcut[] = [
	{ type: "bbcode", key: "KeyB", tag: "b" },
	{ type: "bbcode", key: "KeyI", tag: "i" },
	{ type: "bbcode", key: "KeyU", tag: "u" },
	{ type: "bbcode", key: "KeyS", tag: "s" },
	{ type: "bbcode", key: "KeyD", tag: "color", hasValue: true },
	{ type: "bbcode", key: "ArrowUp", tag: "sup" },
	{ type: "bbcode", key: "ArrowDown", tag: "sub" },
	{ type: "bbcode", key: "KeyL", tag: "url", hasValue: true },
	{ type: "bbcode", key: "KeyR", tag: "user" },
	{ type: "bbcode", key: "KeyO", tag: "icon" },
	{ type: "bbcode", key: "KeyE", tag: "eicon" },
	{ type: "bbcode", key: "KeyK", tag: "spoiler" },
]
