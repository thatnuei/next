import type { TagProps } from "../jsx/types"

interface Props extends TagProps<"input"> {
	onChangeText?: (text: string) => void
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

export default TextInput
