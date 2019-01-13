import { RouteComponentProps } from "@reach/router"
import React, { useContext } from "react"
import AppStore from "../app/AppStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import { fillArea, flexColumn, flexGrow, scrollVertical } from "../ui/helpers"
import { css } from "../ui/styled"
import TextArea from "../ui/TextArea"
import useBottomScroll from "../ui/useBottomScroll"

export default function ChannelRoute(props: RouteComponentProps<{ id: string }>) {
  const { channelStore, identity } = useContext(AppStore.Context)
  const channel = channelStore.getChannel(props.id || "")

  const bottomScrollRef = useBottomScroll<HTMLUListElement>(channel.messages)

  return (
    <AppDocumentTitle title={`${identity} - ${channel.name}`}>
      <section css={[fillArea, flexColumn]}>
        <ul css={[flexGrow, scrollVertical]} ref={bottomScrollRef}>
          {channel.messages.map((message, i) => (
            <li key={i}>
              {message.sender}: {message.message}
            </li>
          ))}
        </ul>
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
