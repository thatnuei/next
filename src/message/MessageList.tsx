import { useRect } from "@reach/rect"
import clsx from "clsx"
import { memo, useDeferredValue, useLayoutEffect, useRef } from "react"
import { useChatContext } from "../chat/ChatContext"
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

function useBottomScroll<E extends Element>(observedValue: unknown) {
  const containerRef = useRef<E>(null)

  // get whether we're bottom scrolled before the dom is rendered
  const wasBottomScrolled = containerRef.current
    ? containerRef.current.scrollTop + containerRef.current.clientHeight >=
      containerRef.current.scrollHeight - bottomScrollThreshold
    : true

  const scrollToBottom = () => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }

  useLayoutEffect(scrollToBottom, [])

  const rect = useRect(containerRef)
  useLayoutEffect(() => {
    // if we were bottom scrolled, scroll to the bottom again
    if (wasBottomScrolled) scrollToBottom()
  }, [wasBottomScrolled, observedValue, rect])

  return containerRef
}
