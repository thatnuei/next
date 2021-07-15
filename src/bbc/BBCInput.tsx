import { Portal } from "@headlessui/react"
import type { Instance as PopperInstance } from "@popperjs/core"
import { createPopperLite } from "@popperjs/core"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { useElementSize } from "../dom/useElementSize"
import type { TagProps } from "../jsx/types"
import { input } from "../ui/components"
import BBC from "./BBC"

interface BBCTextAreaProps extends Omit<TagProps<"textarea">, "className"> {
	maxLength?: number
	value: string
	onChangeText: (value: string) => void
}

export default function BBCTextArea({
	maxLength,
	onChange,
	onChangeText,
	...props
}: BBCTextAreaProps) {
	// debouncing the value for the preview,
	// so it changes less often to reduce distraction
	const previewValue = useDebouncedValue(props.value, 500)

	const [textArea, setTextArea] = useState<Element | null>()
	const textAreaRect = useElementSize(textArea)
	const [textAreaFocused, setTextAreaFocused] = useState(false)

	const [preview, setPreview] = useState<HTMLElement | null>()

	const popperRef = useRef<PopperInstance>()

	useEffect(() => {
		if (!textArea || !preview) return

		const popper = (popperRef.current = createPopperLite(textArea, preview, {
			placement: "top-start",
			modifiers: [{ name: "offset", options: { offset: [10, 20] } }],
		}))

		return () => {
			popper.destroy()
		}
	}, [preview, textArea])

	useEffect(() => {
		popperRef.current?.update()
	})

	return (
		<div className="relative flex flex-col-reverse">
			<textarea
				className={clsx(input, "peer")}
				rows={3}
				onChange={(e) => {
					onChange?.(e)
					onChangeText(e.target.value)
				}}
				ref={setTextArea}
				onFocus={() => {
					setTextAreaFocused(true)
				}}
				onBlur={() => {
					setTextAreaFocused(false)
				}}
				{...props}
			/>

			{maxLength != null && (
				<p className="absolute bottom-0 right-0 p-1.5 text-xs leading-none opacity-60 pointer-events-none">
					{props.value.trim().length} / {maxLength}
				</p>
			)}

			<Portal>
				<div ref={setPreview}>
					<div
						className={clsx(
							"pb-2",
							"transition-all",
							// checking for both to make the preview disappear immediately when cleared
							props.value && previewValue && textAreaFocused
								? "visible opacity-100"
								: "invisible opacity-0",
						)}
					>
						<div
							className="px-3 py-2 overflow-y-auto shadow bg-midnight-0 max-h-32"
							style={{ width: textAreaRect.width }}
						>
							<p className="text-sm opacity-70">Preview</p>
							<BBC text={previewValue} />
						</div>
					</div>
				</div>
			</Portal>
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
