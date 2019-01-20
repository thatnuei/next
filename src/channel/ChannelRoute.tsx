import React, { useContext } from "react"
import AppStore from "../app/AppStore"
import MessageRow from "../message/MessageRow"
import { useRouter } from "../router"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { fillArea, flexColumn, flexGrow, scrollVertical } from "../ui/helpers"
import { css } from "../ui/styled"
import TextArea from "../ui/TextArea"
import useBottomScroll from "../ui/useBottomScroll"

export default function ChannelRoute() {
  const { channelStore, identity } = useContext(AppStore.Context)
  const { param } = useRouter()
  const channel = channelStore.getChannel(param("id"))

  const bottomScrollRef = useBottomScroll<HTMLUListElement>(channel.messages)

  return (
    <AppDocumentTitle title={`${identity} - ${channel.name}`}>
      <section css={[fillArea, flexColumn]}>
        <section css={[flexGrow, scrollVertical]} ref={bottomScrollRef}>
          {channel.messages.map((message, i) => (
            <MessageRow key={i} {...message} />
          ))}
        </section>
        <form css={inputContainerStyle} onSubmit={(event) => event.preventDefault()}>
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
