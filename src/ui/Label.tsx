import { ComponentPropsWithoutRef } from "react"

export default function Label({
	text,
	children,
	className,
	...props
}: ComponentPropsWithoutRef<"label"> & {
	text: React.ReactNode
}) {
	return (
		<label className="w-full" {...props}>
			<div className="text-sm">{text}</div>
			{children}
		</label>
	)
}
