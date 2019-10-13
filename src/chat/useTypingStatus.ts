import { useEffect, useRef } from "react"
import { TypingStatus } from "./types"

export default function useTypingStatus(
  input: string,
  handleStatusChange?: (status: TypingStatus) => void,
) {
  const handlerRef = useRef(handleStatusChange)

  useEffect(() => {
    handlerRef.current = handleStatusChange
  }, [handleStatusChange])

  useEffect(() => {
    const handler = handlerRef.current
    if (!handler) return

    if (input === "") {
      handler("clear")
      return
    }

    handler("typing")

    const timeout = setTimeout(() => {
      handler("paused")
    }, 1500)

    return () => clearTimeout(timeout)
  }, [input])
}
