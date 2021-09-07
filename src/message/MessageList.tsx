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
  const containerRef = useBottomScroll<HTMLOListElement>(deferredMessages)
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

function useBottomScroll<E extends HTMLElement>(observedValue: unknown) {
  const containerRef = useRef<E>(null)
  const rect = useRect(containerRef)
  const scrollRef = useRef(0)
  const scrollHeightRef = useRef(0)

  const scrollToBottom = () => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }

  const updateScrollRef = () => {
    if (containerRef.current) {
      scrollRef.current = containerRef.current.scrollTop
    }
  }

  const updateScrollHeightRef = () => {
    if (containerRef.current) {
      scrollHeightRef.current =
        containerRef.current.scrollHeight - containerRef.current.clientHeight
    }
  }

  // scroll to bottom initially
  useLayoutEffect(() => {
    scrollToBottom()
    updateScrollRef()
    updateScrollHeightRef()
  }, [])

  // scroll to bottom when the observed value changes
  // we don't expect the height to have changed here,
  // so don't update the scroll height ref
  useLayoutEffect(() => {
    if (scrollRef.current > scrollHeightRef.current - bottomScrollThreshold) {
      scrollToBottom()
    }
    updateScrollRef()
  }, [observedValue])

  // only update scroll height ref when we expect a change in the scroll height
  useLayoutEffect(() => {
    if (scrollRef.current > scrollHeightRef.current - bottomScrollThreshold) {
      scrollToBottom()
    }
    updateScrollRef()
    updateScrollHeightRef()
  }, [rect])

  useDomEvent(
    containerRef,
    "scroll",
    () => {
      // the scroll event can fire when the rect height changes,
      // rIC to ensure the rect handler runs before this
      requestIdleCallback(() => {
        updateScrollRef()
      })
    },
    { passive: true },
  )

  return containerRef
}
