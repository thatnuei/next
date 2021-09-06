import type { BBCodeShortcut } from "./shortcuts"

export function applyBBCodeShortcut(
  element: HTMLTextAreaElement,
  shortcut: BBCodeShortcut,
): string {
  const { selectionStart, selectionEnd, value } = element

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
      element.setSelectionRange(position, position)
    } else {
      element.setSelectionRange(
        selectionStart + tagStart.length,
        selectionEnd + tagStart.length,
      )
    }
  })

  return newText
}
