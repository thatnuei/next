import { observer } from "mobx-react-lite"
import React from "react"
import { CharacterStore } from "../character/CharacterStore"
import Chatbox from "../chat/Chatbox"
import RoomLayout from "../chat/RoomLayout"
import RoomUserList from "../chat/RoomUserList"
import Button from "../dom/components/Button"
import MessageList from "../message/MessageList"
import { useToggle } from "../state/hooks/useToggle"
import { fadedButton } from "../ui/components"
import Drawer from "../ui/components/Drawer"
import Icon from "../ui/components/Icon"
import Modal from "../ui/components/Modal"
import {
  block,
  displayNone,
  h,
  media,
  p,
  relative,
  w,
  wh,
} from "../ui/helpers.new"
import ChannelDescription from "./ChannelDescription"
import ChannelHeader from "./ChannelHeader"
import { ChannelModel } from "./ChannelModel"

type Props = {
  channel: ChannelModel
  identity: string
  characterStore: CharacterStore
}

function ChannelRoom({ channel, identity, characterStore }: Props) {
  const [menuVisible, menuActions] = useToggle()
  const [descriptionVisible, descriptionActions] = useToggle()

  const users = [...channel.users].map(characterStore.get)

  const channelMenuButton = (
    <Button
      css={[fadedButton, p(3), media.xl(displayNone)]}
      onClick={menuActions.toggle}
    >
      <Icon name="more" />
    </Button>
  )

  const header = (
    <ChannelHeader
      title={channel.name}
      right={channelMenuButton}
      onShowDescription={descriptionActions.toggle}
    />
  )

  const body = (
    <div css={[wh("full"), relative]}>
      <MessageList
        messages={channel.room.messages}
        characterStore={characterStore}
      />
      <Modal
        title={channel.name}
        visible={descriptionVisible}
        panelWidth={800}
        children={<ChannelDescription description={channel.description} />}
        fillMode="contained"
        onClose={descriptionActions.disable}
      />
    </div>
  )

  const footer = (
    <Chatbox
      value={channel.room.input}
      placeholder={`Chatting as ${identity}...`}
      onValueChange={channel.room.setInput}
      onSubmit={(text) => console.log(`submitted: ${text}`)}
    />
  )

  const sidebar = (
    <div css={[h("full"), displayNone, media.xl(block)]}>
      <RoomUserList users={users} css={[w(64), h("full")]} />
    </div>
  )

  return (
    <>
      <RoomLayout
        header={header}
        body={body}
        footer={footer}
        sidebar={sidebar}
      />
      <Drawer side="right" visible={menuVisible} onClose={menuActions.disable}>
        <RoomUserList users={users} css={[w(64), h("full")]} />
      </Drawer>
    </>
  )
}

export default observer(ChannelRoom)
