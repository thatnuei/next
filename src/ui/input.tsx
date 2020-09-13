import { ComponentPropsWithoutRef } from "react"

export function TextInput({
	onChange,
	onChangeText,
	...props
}: ComponentPropsWithoutRef<"input"> & {
	onChangeText?: (text: string) => void
}) {
	return (
		<input
			className="block w-full px-3 py-2 transition-colors duration-200 bg-midnight-1 focus:outline-none focus:bg-midnight-2"
			onChange={event => {
				onChange?.(event)
				onChangeText?.(event.target.value)
			}}
			{...props}
		/>
	)
}
