import * as React from "react"
import { tw } from "twind"

type Props = {
	labelText: string
	children: React.ReactNode
}

function FormField({ labelText, children }: Props) {
	return (
		<label className={tw`block w-full`}>
			<div className={tw`mb-1`}>{labelText}</div>
			{children}
		</label>
	)
}

export default FormField
