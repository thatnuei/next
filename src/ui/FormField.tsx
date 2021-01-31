import * as React from "react"
import tw from "twin.macro"

type Props = React.ComponentPropsWithoutRef<"label"> & {
	labelText: string
	children: React.ReactNode
}

function FormField({ labelText, children, ...props }: Props) {
	return (
		<label css={tw`block w-full`} {...props}>
			<div css={tw`mb-1`}>{labelText}</div>
			{children}
		</label>
	)
}

export default FormField
