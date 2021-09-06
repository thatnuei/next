import { useRect } from "@reach/rect"
import clsx from "clsx"
import { memo, useDeferredValue, useLayoutEffect, useRef } from "react"
import { useChatContext } from "../chat/ChatContext"
import { useDomEvent } from "../dom/useDomEvent"
import MessageListItem from "./MessageListItem"
import type { MessageState } from "./MessageState"

type Props = {
  messages: readonly MessageState[]
}

export default memo(function MessageList({ messages }: Props) {
  const deferredMessages = useDeferredValue(messages)
  const isStale = deferredMessages !== messages
  const containerRef = useBottomScroll<HTMLOListElement>(messages)
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
          onDragStart={(event) => event.preventDefault()}
        >
          <MessageListItem message={message} />
        </li>
      ))}
    </ol>
  )
})

const bottomScrollThreshold = 20

const scrollBottom = (element: Element) =>
  element ? element.scrollTop + element.clientHeight : 0

function useBottomScroll<E extends HTMLElement>(observedValue: unknown) {
  const containerRef = useRef<E>(null)
  const rect = useRect(containerRef)

  const scrollRef = useRef<number>()
  if (scrollRef.current === undefined && containerRef.current) {
    scrollBottom(containerRef.current)
  }

  const scrollToBottom = () => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }

  const updateScrollRef = () => {
    if (containerRef.current) {
      scrollRef.current = scrollBottom(containerRef.current)
    }
  }

  useLayoutEffect(scrollToBottom, [])

  useLayoutEffect(() => {
    const scrollHeight = containerRef.current?.scrollHeight ?? 0

    if ((scrollRef.current ?? 0) > scrollHeight - bottomScrollThreshold) {
      scrollToBottom()
    }

    updateScrollRef()
  }, [observedValue, rect])

  useDomEvent(containerRef, "scroll", updateScrollRef, { passive: true })

  return containerRef
}
