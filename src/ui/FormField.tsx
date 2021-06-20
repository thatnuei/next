import * as React from "react"

interface Props {
	labelText: string
	children: React.ReactNode
}

function FormField({ labelText, children }: Props) {
	return (
		<label className={`block w-full`}>
			<div className={`mb-1`}>{labelText}</div>
			{children}
		</label>
	)
}

export default FormField
