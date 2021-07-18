import { Portal } from "@headlessui/react"
import clsx from "clsx"
import type { SyntheticEvent } from "react"
import { useEffect, useState } from "react"
import { useElementSize } from "../dom/useElementSize"
import type { TagProps } from "../jsx/types"
import combineRefs from "../react/combineRefs"
import { input } from "../ui/components"
import usePopper from "../ui/usePopper"
import BBC from "./BBC"
import KeyboardShortcutsPopoverButton from "./KeyboardShortcutsPopoverButton"
import { shortcuts } from "./shortcuts"

interface BBCTextAreaProps extends Omit<TagProps<"textarea">, "className"> {
	maxLength?: number
	value: string
	onChangeText: (value: string) => void
}

export default function BBCTextArea({
	maxLength,
	onFocus,
	onBlur,
	onKeyDown,
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

	const popper = usePopper()

	function runBBCodeShortcut(
		event: SyntheticEvent<HTMLTextAreaElement>,
		tag: string,
	): void {
		event.preventDefault()

		const target = event.currentTarget
		const { selectionStart, selectionEnd, value } = target

		const tagStart = `[${tag}]`
		const tagEnd = `[/${tag}]`

		const newText =
			value.slice(0, selectionStart) +
			tagStart +
			value.slice(selectionStart, selectionEnd) +
			tagEnd +
			value.slice(selectionEnd)

		onChangeText(newText)

		// need to wait for a re-render before setting the selection
		requestAnimationFrame(() => {
			target.setSelectionRange(
				selectionStart,
				selectionEnd + tagStart.length + tagEnd.length,
			)
		})
	}

	return (
		<div className="relative flex flex-col-reverse">
			<textarea
				className={clsx(input, "peer")}
				rows={3}
				ref={combineRefs<HTMLElement>(setTextArea, popper.referenceRef)}
				onChange={(event) => {
					onChangeText(event.target.value)
					onChange?.(event)
				}}
				onFocus={(event) => {
					setTextAreaFocused(true)
					onFocus?.(event)
				}}
				onBlur={(event) => {
					setTextAreaFocused(false)
					onBlur?.(event)
				}}
				onKeyDown={(event) => {
					onKeyDown?.(event)

					if (event.ctrlKey) {
						const shortcut = shortcuts.find((s) => s.key === event.code)
						if (shortcut?.type === "bbcode") {
							runBBCodeShortcut(event, shortcut.tag)
						}
					}
				}}
				{...props}
			/>

			{maxLength != null && (
				<p className="absolute bottom-0 right-0 p-1.5 text-xs leading-none opacity-60 pointer-events-none">
					{props.value.trim().length} / {maxLength}
				</p>
			)}

			<div className="absolute top-0 right-0 p-1">
				<KeyboardShortcutsPopoverButton />
			</div>

			<Portal>
				<div ref={popper.popperRef} className="pointer-events-none">
					<div
						className={clsx(
							"pb-2 pointer-events-auto",
							"transition-all",
							// checking for both to make the preview disappear immediately when cleared
							props.value && previewValue && textAreaFocused
								? "visible opacity-100"
								: "invisible opacity-0 -translate-y-2",
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
