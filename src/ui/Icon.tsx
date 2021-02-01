import * as React from "react"
import { tw } from "twind"

export type IconProps = React.ComponentPropsWithoutRef<"svg"> & {
	which: string
}

function Icon({ which, ...props }: IconProps) {
	return (
		<svg className={tw`w-5 h-5`} viewBox="0 0 24 24" {...props}>
			<path d={which} className={tw`fill-current`} />
		</svg>
	)
}

export default Icon
