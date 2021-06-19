import * as React from "react"

export type IconProps = {
	which: string
}

export const iconSizeClass = `w-6 h-6`

export default function Icon({ which }: IconProps) {
	return (
		<svg className={iconSizeClass} viewBox="0 0 24 24">
			<path d={which} className={`fill-current`} />
		</svg>
	)
}
