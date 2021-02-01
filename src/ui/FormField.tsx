import * as React from "react"
import { tw } from "twind"

type Props = React.ComponentPropsWithoutRef<"label"> & {
	labelText: string
	children: React.ReactNode
}

function FormField({ labelText, children, ...props }: Props) {
	return (
		<label className={tw`block w-full`} {...props}>
			<div className={tw`mb-1`}>{labelText}</div>
			{children}
		</label>
	)
}

export default FormField
