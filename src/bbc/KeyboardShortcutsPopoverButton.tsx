import { Popover, Portal } from "@headlessui/react"
import clsx from "clsx"
import { chunk } from "lodash-es"
import { fadedButton, headerText2, raisedPanel } from "../ui/components"
import KeyboardIcon from "../ui/KeyboardIcon"
import usePopper from "../ui/usePopper"
import { shortcuts } from "./shortcuts"

export default function KeyboardShortcutsPopoverButton() {
  const popper = usePopper()

  return (
    <Popover className="relative">
      <Popover.Button
        className={clsx(fadedButton, "p-2 -m-2")}
        title="Keyboard Shortcuts"
        ref={popper.referenceRef}
      >
        <KeyboardIcon className="w-6 h-6" />
      </Popover.Button>
      <Portal>
        <Popover.Panel
          className={clsx(raisedPanel, "absolute mx-auto bottom-full")}
          ref={popper.popperRef}
        >
          <h2 className={clsx(headerText2, "bg-midnight-0 text-center p-2")}>
            Keyboard Shortcuts
          </h2>
          <div className="bg-midnight-1">
            <ShortcutList />
          </div>
        </Popover.Panel>
      </Portal>
    </Popover>
  )
}

function ShortcutList() {
  return (
    <>
      {chunk(shortcuts, 2).map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-2 gap-3 px-3 py-2 even:bg-black/20"
        >
          {row.map((s) => (
            <Shortcut key={s.key} keyboardKey={s.key} tag={s.tag} />
          ))}
        </div>
      ))}
    </>
  )
}

function Shortcut(props: { keyboardKey: string; tag: string }) {
  return (
    <p className="flex justify-between gap-4 leading-tight">
      <span>
        <KeyboardKey>Ctrl</KeyboardKey>+
        <KeyboardKey>{toReadableKey(props.keyboardKey)}</KeyboardKey>
      </span>
      <span>[{props.tag}]</span>
    </p>
  )
}

function KeyboardKey({ children }: { children: React.ReactNode }) {
  return <code className="px-1 py-0.5 rounded bg-black/50">{children}</code>
}

/**
 * Convert a keyboard event code to a human readable key
 */
function toReadableKey(code: string): string {
  return code.replace(/^(Key|Arrow)/, "")
}
