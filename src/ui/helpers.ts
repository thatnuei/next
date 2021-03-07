import type { Directive } from "twind"
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

export function radixTransition({
	start,
	end,
}: {
	start: Directive<any>
	end: Directive<any>
}) {
	return css({
		"&[data-state=open], [data-state=open] &": animation("0.2s", {
			from: start,
			to: end,
		}),
		"&[data-state=closed], [data-state=closed] &": animation("0.2s", {
			from: end,
			to: start,
		}),
	})
}
