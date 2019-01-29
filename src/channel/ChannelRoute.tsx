import React from "react"
import MessageRow from "../message/MessageRow"
import { MessageWithSender } from "../message/types"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { fillArea, flexColumn, flexGrow, scrollVertical } from "../ui/helpers"
import { css } from "../ui/styled"
import TextArea from "../ui/TextArea"
import useBottomScroll from "../ui/useBottomScroll"
import { Channel } from "./types"

type Props = {
  channel: Channel
  identity: string
  messages: MessageWithSender[]
}

export default function ChannelRoute({ channel, identity, messages }: Props) {
  const bottomScrollRef = useBottomScroll<HTMLUListElement>(channel.messages)

  const renderMessage = (message: MessageWithSender) => (
    <MessageRow key={message.id} {...message} />
  )

  return (
    <AppDocumentTitle title={`${identity} - ${channel.name}`}>
      <section css={[fillArea, flexColumn]}>
        <section css={[flexGrow, scrollVertical]} ref={bottomScrollRef}>
          {messages.map(renderMessage)}
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

const inputContainerStyle = css`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${themeColor};
`
