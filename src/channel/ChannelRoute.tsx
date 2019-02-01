import { observer } from "mobx-react-lite"
import React, { useContext } from "react"
import ChatStore from "../chat/ChatStore"
import MessageRow from "../message/MessageRow"
import { Message } from "../message/types"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { fillArea, flexColumn, flexGrow, scrollVertical } from "../ui/helpers"
import { css } from "../ui/styled"
import TextArea from "../ui/TextArea"
import useBottomScroll from "../ui/useBottomScroll"
import { Channel } from "./types"

type Props = {
  channelId: string
}

function getFilteredMessages(channel: Channel) {
  if (channel.mode !== "both") {
    return channel.messages
  }

  return channel.messages.filter((msg) => {
    // admin and system messages should always be visible
    if (channel.selectedMode === "ads") return msg.type !== "chat"
    if (channel.selectedMode === "chat") return msg.type !== "lfrp"
    return true
  })
}

function ChannelRoute({ channelId }: Props) {
  const { channelStore, identity } = useContext(ChatStore.Context)
  const channel = channelStore.channels.get(channelId)

  const bottomScrollRef = useBottomScroll<HTMLUListElement>(channel.messages)

  const filteredMessages = getFilteredMessages(channel)

  const renderMessage = (message: Message) => (
    <MessageRow key={message.id} {...message} />
  )

  return (
    <AppDocumentTitle title={`${identity} - ${channel.name}`}>
      <section css={[fillArea, flexColumn]}>
        <section css={[flexGrow, scrollVertical]} ref={bottomScrollRef}>
          {filteredMessages.map(renderMessage)}
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
