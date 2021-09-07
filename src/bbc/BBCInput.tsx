import clsx from "clsx"
import type { ReactNode } from "react"
import { isUrl } from "../common/isUrl"
import type { TagProps } from "../jsx/types"
import type { InputState } from "../state/input"
import {
  getInputStateValue,
  inputStateRedo,
  inputStateUndo,
  setInputStateValue,
} from "../state/input"
import { useDebouncedValue } from "../state/useDebouncedValue"
import { input } from "../ui/components"
import { applyBBCodeShortcut } from "./applyBBCodeShortcut"
import { insertBBCForPastedUrl } from "./insertBBCForPastedUrl"
import KeyboardShortcutsPopoverButton from "./KeyboardShortcutsPopoverButton"
import { shortcuts } from "./shortcuts"

type BBCTextAreaProps = {
  maxLength?: number
  inputState: InputState
  onInputStateChange: (inputState: InputState) => void
  renderPreview: (previewValue: string) => ReactNode
} & Omit<TagProps<"textarea">, "className" | "value">

export default function BBCTextArea({
  inputState,
  maxLength,
  onInputStateChange,
  onKeyDown,
  onChange,
  renderPreview,
  ...props
}: BBCTextAreaProps) {
  const value = getInputStateValue(inputState)

  // debouncing the value for the preview,
  // so it changes less often to reduce distraction
  const previewValue = useDebouncedValue(value, 500)

  const valueTrimmed = value.trim()
  const valueLength = valueTrimmed.length

  return (
    <div className="relative flex flex-col gap-2">
      {previewValue && value ? (
        // vertical padding fixes an issue where the scroll arrows show up due to line height,
        // even if not at max height
        <div className="px-3 py-2 overflow-y-auto bg-midnight-1 max-h-24">
          {renderPreview(previewValue)}
        </div>
      ) : undefined}

      <div className="relative">
        <textarea
          value={value}
          className={clsx(input, "peer")}
          rows={3}
          onChange={(event) => {
            onChange?.(event)
            onInputStateChange(
              setInputStateValue(inputState, event.target.value),
            )
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event)

            const isCtrlOrCmd =
              (event.ctrlKey || event.metaKey) &&
              !event.shiftKey &&
              !event.altKey

            if (isCtrlOrCmd) {
              if (event.code === "KeyZ") {
                event.preventDefault()
                onInputStateChange(inputStateUndo(inputState))
                return
              }

              if (event.code === "KeyY") {
                event.preventDefault()
                onInputStateChange(inputStateRedo(inputState))
                return
              }

              const shortcut = shortcuts.find((s) => s.key === event.code)
              if (shortcut?.type === "bbcode") {
                event.preventDefault()
                onInputStateChange(
                  setInputStateValue(
                    inputState,
                    applyBBCodeShortcut(event.currentTarget, shortcut),
                  ),
                )
                return
              }
            }
          }}
          onPaste={(event) => {
            const text = event.clipboardData.getData("text/plain")
            if (isUrl(text)) {
              event.preventDefault()
              onInputStateChange(
                setInputStateValue(
                  inputState,
                  insertBBCForPastedUrl(event.currentTarget, text),
                ),
              )
              return
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
