import clsx from "clsx"
import { useEffect, useState } from "react"
import type { TagProps } from "../jsx/types"
import { input } from "../ui/components"
import BBC from "./BBC"

interface BBCTextAreaProps extends Omit<TagProps<"textarea">, "className"> {
	value: string
	onChangeText: (value: string) => void
}

export default function BBCTextArea({
	onChange,
	onChangeText,
	...props
}: BBCTextAreaProps) {
	const previewValue = useDebouncedValue(props.value, 500)

	return (
		<div className="relative flex flex-col-reverse">
			<textarea
				className={clsx(input, "h-16 peer")}
				onChange={(e) => {
					onChange?.(e)
					onChangeText(e.target.value)
				}}
				{...props}
			/>
			<div
				className={clsx(
					"px-3 py-2 overflow-y-auto shadow bg-midnight-1 max-h-24",
					"absolute inset-x-2 bottom-full -translate-y-2",
					"transition-all invisible opacity-0",
					previewValue && "peer-focus:visible peer-focus:opacity-100",
				)}
			>
				<p className="text-sm opacity-70">Preview</p>
				<BBC text={previewValue} />
			</div>
		</div>
	)
}

function useDebouncedValue<T>(value: T, duration = 500): T {
	const [currentValue, setCurrentValue] = useState(value)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setCurrentValue(value)
		}, duration)
		return () => clearTimeout(timeout)
	}, [duration, value])

	return currentValue
}
