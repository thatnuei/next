import type { ComponentProps } from "react"
import { autoRef } from "../react/autoRef"

interface Props extends ComponentProps<"input"> {
	onChangeText?: (text: string) => void
	// ref?: Ref<HTMLInputElement>
}

function TextInput({ onChange, onChangeText, ...props }: Props) {
	return (
		<input
			onChange={(event) => {
				onChange?.(event)
				onChangeText?.(event.target.value)
			}}
			{...props}
		/>
	)
}

export default autoRef<Props, HTMLInputElement>(TextInput)
