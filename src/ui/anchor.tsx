import { ComponentPropsWithoutRef } from "react"

export function AnchorText({
	className,
	...props
}: ComponentPropsWithoutRef<"span">) {
	return (
		<span
			className="underline transition-opacity duration-200 opacity-50 hover:opacity-75"
			{...props}
		/>
	)
}
