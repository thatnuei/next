import { ComponentPropsWithoutRef } from "react"

export default function TextInput({
	onChange,
	onChangeText,
	...props
}: ComponentPropsWithoutRef<"input"> & {
	onChangeText?: (text: string) => void
}) {
	return (
		<input
			onChange={event => {
				onChange?.(event)
				onChangeText?.(event.target.value)
			}}
			{...props}
		/>
	)
}
