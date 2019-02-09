import { observer } from "mobx-react-lite"
import React, { useRef } from "react"
import MessageRow from "../message/MessageRow"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { fillArea, flexColumn, flexGrow, scrollVertical } from "../ui/helpers"
import { css } from "../ui/styled"
import TextArea from "../ui/TextArea"
import useBottomScroll from "../ui/useBottomScroll"
import ChannelModel from "./ChannelModel"

type Props = {
  channel: ChannelModel
}

function ChannelRoute({ channel }: Props) {
  const { chatStore } = useRootStore()

  const messageListRef = useRef<HTMLElement>(null)

  useBottomScroll(messageListRef, channel.lastMessage)

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
