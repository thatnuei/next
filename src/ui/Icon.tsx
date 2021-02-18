import * as React from "react"
import { tw } from "twind"

export type IconProps = {
	which: string
}

export const iconSizeClass = tw`w-6 h-6`

export default function Icon({ which }: IconProps) {
	return (
		<svg className={iconSizeClass} viewBox="0 0 24 24">
			<path d={which} className={tw`fill-current`} />
		</svg>
	)
}
