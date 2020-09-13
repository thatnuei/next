import { ComponentPropsWithoutRef } from "react"

export function Select({
	onChange,
	onChangeValue,
	className,
	...props
}: ComponentPropsWithoutRef<"select"> & {
	onChangeValue?: (text: string) => void
}) {
	return (
		<select
			className="block w-full px-3 py-2 transition-colors duration-200 bg-midnight-1 focus:outline-none focus:bg-midnight-2"
			onChange={event => {
				onChange?.(event)
				onChangeValue?.(event.target.value)
			}}
			{...props}
		/>
	)
}
