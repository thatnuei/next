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
import type { BBCodeShortcut } from "./shortcuts"
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

	const valueTrimmed = props.value.trim()
	const valueLength = valueTrimmed.length

	const [textArea, setTextArea] = useState<Element | null>()
	const textAreaRect = useElementSize(textArea)
	const [textAreaFocused, setTextAreaFocused] = useState(false)

	const popper = usePopper()

	return (
		<div className="flex flex-col-reverse relative">
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
							onChangeText(applyBBCodeShortcut(event, shortcut))
						}
					}
				}}
				{...props}
			/>

			{maxLength != null && (
				<p
					className={clsx(
						"absolute bottom-0 right-0 p-1.5 text-xs leading-none opacity-60 pointer-events-none",
						valueLength > (maxLength ?? Infinity) ? "text-red-500" : "",
					)}
				>
					{valueLength} / {maxLength}
				</p>
			)}

			<div className="p-1 top-0 right-0 absolute">
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
							className="bg-midnight-0 shadow max-h-32 py-2 px-3 overflow-y-auto"
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

function applyBBCodeShortcut(
	event: SyntheticEvent<HTMLTextAreaElement>,
	shortcut: BBCodeShortcut,
): string {
	event.preventDefault()

	const target = event.currentTarget
	const { selectionStart, selectionEnd, value } = target

	const tagStart = shortcut.hasValue
		? `[${shortcut.tag}=]`
		: `[${shortcut.tag}]`
	const tagEnd = `[/${shortcut.tag}]`

	const newText =
		value.slice(0, selectionStart) +
		tagStart +
		value.slice(selectionStart, selectionEnd) +
		tagEnd +
		value.slice(selectionEnd)

	// need to wait for a re-render before setting the selection
	requestAnimationFrame(() => {
		if (shortcut.hasValue) {
			const position = selectionStart + tagStart.length - 1
			target.setSelectionRange(position, position)
		} else {
			target.setSelectionRange(
				selectionStart + tagStart.length,
				selectionEnd + tagStart.length,
			)
		}
	})

	return newText
}
