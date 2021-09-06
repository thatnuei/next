export function insertBBCForPastedUrl(
  element: HTMLTextAreaElement,
  text: string,
) {
  const tagStart = `[url=${text}]`
  const tagEnd = `[/url]`

  const { selectionStart, selectionEnd, value } = element

  const selectedText = value.slice(selectionStart, selectionEnd)

  const newValue =
    value.slice(0, selectionStart) +
    tagStart +
    selectedText +
    tagEnd +
    value.slice(selectionEnd)

  requestAnimationFrame(() => {
    element.setSelectionRange(
      selectionStart + tagStart.length,
      selectionStart + tagStart.length + selectedText.length,
    )
  })

  return newValue
}
