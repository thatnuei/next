import { ComponentPropsWithoutRef } from "react"

export function SolidButton({
	className,
	...props
}: ComponentPropsWithoutRef<"button">) {
	return (
		<button
			type="button"
			className="px-3 py-2 transition-colors duration-200 bg-midnight-1 hover:bg-midnight-2"
			{...props}
		/>
	)
}
