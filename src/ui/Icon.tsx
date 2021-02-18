import * as React from "react"
import { tw } from "twind"

export type IconProps = {
	which: string
	size?: "normal" | "small"
}

function Icon({ which, size = "normal" }: IconProps) {
	return (
		<svg
			className={tw(
				size === "normal" && "w-5 h-5",
				size === "small" && "w-4 h-4",
			)}
			viewBox="0 0 24 24"
		>
			<path d={which} className={tw`fill-current`} />
		</svg>
	)
}

export default Icon
