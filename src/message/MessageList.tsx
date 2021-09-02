import clsx from "clsx"
import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react"
import { useChatContext } from "../chat/ChatContext"
import MessageListItem from "./MessageListItem"
import type { MessageState } from "./MessageState"

type Props = {
  messages: readonly MessageState[]
}

export default memo(function MessageList({ messages }: Props) {
  const deferredMessages = useDeferredValue(messages)
  const isStale = deferredMessages !== messages
  const containerRef = useBottomScroll()
  const identity = useChatContext().identity

  return (
    <ol
      className={clsx(
        "h-full overflow-y-auto transition-opacity transform translate-z-0",
        isStale && `opacity-50`,
      )}
      style={{ transitionDelay: isStale ? "0.5s" : "0s" }}
      ref={containerRef}
    >
      {deferredMessages.map((message) => (
        <li
          key={message.key}
          className={clsx(message.senderName === identity && "bg-black/30")}
        >
          <MessageListItem message={message} />
        </li>
      ))}
    </ol>
  )
})

const bottomScrollThreshold = 20

function useBottomScroll() {
  const [container, containerRef] = useState<Element | null>()
  const bottomScrolledRef = useRef(true)

  const scrollToBottom = useCallback(() => {
    if (container && bottomScrolledRef.current) {
      container.scrollTop = container.scrollHeight
    }
  }, [container])

  useEffect(() => {
    bottomScrolledRef.current = true
    scrollToBottom()
  }, [scrollToBottom])

  useEffect(() => {
    if (!container) return

    const handleScroll = () => {
      bottomScrolledRef.current =
        container.scrollTop >=
        container.scrollHeight - container.clientHeight - bottomScrollThreshold
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  })

  useEffect(() => {
    if (!container) return

    const observer = new ResizeObserver(scrollToBottom)

    observer.observe(container)
    return () => observer.disconnect()
  })

  useEffect(() => {
    if (!container) return

    const observer = new MutationObserver(scrollToBottom)

    observer.observe(container, {
      childList: true,
    })

    return () => observer.disconnect()
  })

  return containerRef
}
