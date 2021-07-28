import { Portal } from "@headlessui/react"
import clsx from "clsx"
import { useState } from "react"
import { isUrl } from "../common/isUrl"
import { useElementSize } from "../dom/useElementSize"
import type { TagProps } from "../jsx/types"
import combineRefs from "../react/combineRefs"
import { useDebouncedValue } from "../state/useDebouncedValue"
import { input } from "../ui/components"
import usePopper from "../ui/usePopper"
import { applyBBCodeShortcut } from "./applyBBCodeShortcut"
import BBC from "./BBC"
import { insertBBCForPastedUrl } from "./insertBBCForPastedUrl"
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
							event.preventDefault()
							onChangeText(applyBBCodeShortcut(event.currentTarget, shortcut))
						}
					}
				}}
				onPaste={(event) => {
					const text = event.clipboardData.getData("text/plain")
					if (isUrl(text)) {
						event.preventDefault()
						onChangeText(insertBBCForPastedUrl(event.currentTarget, text))
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
