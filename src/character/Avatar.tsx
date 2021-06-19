import * as React from "react"
import { getAvatarUrl } from "../flist/helpers"

type Props = React.ComponentPropsWithoutRef<"img"> & {
	name: string
}

function Avatar({ name, className, ...props }: Props) {
	return (
		<img
			src={getAvatarUrl(name)}
			title={name}
			alt=""
			role="presentation"
			className={`w-24 h-24 ${className}`}
			key={name}
			{...props}
		/>
	)
}

export default Avatar
