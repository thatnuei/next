import { animation, css } from "twind/css"

export const ellipsize = css({
	overflow: "hidden",
	whiteSpace: "nowrap",
	textOverflow: "ellipsis",
})

export const rainbowAnimation = animation(`5s infinite`, {
	"from": { color: "#6666ff" },
	"10%": { color: "#0099ff" },
	"50%": { color: "#00ff00" },
	"75%": { color: "#ff3399" },
	"100%": { color: "#6666ff" },
})
