import { observe } from "mobx"
import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import MessageRow from "../message/MessageRow"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { fillArea, flexColumn, flexGrow, scrollVertical } from "../ui/helpers"
import { css } from "../ui/styled"
import TextArea from "../ui/TextArea"
import ChannelModel from "./ChannelModel"

type Props = {
  channel: ChannelModel
}

function ChannelRoute({ channel }: Props) {
  const { chatStore } = useRootStore()

  const messageListRef = useRef<HTMLElement>(null)

  useBottomScroll(messageListRef, channel.messages)

  return (
    <AppDocumentTitle title={`${chatStore.identity} - ${channel.name}`}>
      <section css={[fillArea, flexColumn]}>
        <section css={[flexGrow, scrollVertical]} ref={messageListRef}>
          {channel.filteredMessages.map((message) => (
            <MessageRow key={message.id} {...message} />
          ))}
        </section>
        <form
          css={inputContainerStyle}
          onSubmit={(event) => event.preventDefault()}
        >
          <TextArea />
          <Button>Send</Button>
        </form>
      </section>
    </AppDocumentTitle>
  )
}
export default observer(ChannelRoute)

const inputContainerStyle = css`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${themeColor};
`

function useBottomScroll(
  elementRef: React.RefObject<HTMLElement>,
  value: unknown,
) {
  useEffect(() => {
    const element = elementRef.current
    if (element) element.scrollTop = element.scrollHeight

    return observe(value as Object, () => {
      const element = elementRef.current
      if (!element) return

      const wasBottomScrolled =
        element != null &&
        element.scrollTop >= element.scrollHeight - element.clientHeight - 100

      requestAnimationFrame(() => {
        if (wasBottomScrolled) {
          element.scrollTop = element.scrollHeight
        }
      })
    })
  })
}
