import useMedia from "../ui/useMedia"

const navigationBreakpoint = 950

export default function useChatNavBreakpoint() {
  const isVisible = useMedia(`(min-width: ${navigationBreakpoint}px)`)
  return isVisible
}
