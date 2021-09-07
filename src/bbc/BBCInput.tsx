import clsx from "clsx"
import type { ReactNode } from "react"
import { isUrl } from "../common/isUrl"
import type { TagProps } from "../jsx/types"
import { useDebouncedValue } from "../state/useDebouncedValue"
import { input } from "../ui/components"
import { applyBBCodeShortcut } from "./applyBBCodeShortcut"
import { insertBBCForPastedUrl } from "./insertBBCForPastedUrl"
import KeyboardShortcutsPopoverButton from "./KeyboardShortcutsPopoverButton"
import { shortcuts } from "./shortcuts"

type BBCTextAreaProps = {
  maxLength?: number
  value: string
  onChangeText: (value: string) => void
  renderPreview: (previewValue: string) => ReactNode
} & Omit<TagProps<"textarea">, "className">

export default function BBCTextArea({
  maxLength,
  onKeyDown,
  onChange,
  onChangeText,
  renderPreview,
  ...props
}: BBCTextAreaProps) {
  // debouncing the value for the preview,
  // so it changes less often to reduce distraction
  const previewValue = useDebouncedValue(props.value, 500)

  const valueTrimmed = props.value.trim()
  const valueLength = valueTrimmed.length

  return (
    <div className="relative flex flex-col gap-2">
      {previewValue && props.value ? (
        // vertical padding fixes an issue where the scroll arrows show up due to line height,
        // even if not at max height
        <div className="px-3 py-2 overflow-y-auto bg-midnight-1 max-h-24">
          {renderPreview(previewValue)}
        </div>
      ) : undefined}

      <div className="relative">
        <textarea
          className={clsx(input, "peer")}
          rows={3}
          onChange={(event) => {
            onChangeText(event.target.value)
            onChange?.(event)
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

        <div className="absolute top-0 right-0 p-1">
          <KeyboardShortcutsPopoverButton />
        </div>
      </div>
    </div>
  )
}
