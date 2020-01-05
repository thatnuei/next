import { observer, Observer } from "mobx-react-lite"
import React from "react"
import { CharacterStore } from "../character/CharacterStore.new"
import Chatbox from "../chat/components/Chatbox"
import RoomLayout from "../chat/components/RoomLayout"
import RoomUserList from "../chat/components/RoomUserList"
import MessageList from "../message/MessageList"
import { useToggle } from "../state/hooks/useToggle"
import Drawer from "../ui/components/Drawer"
import Modal from "../ui/components/Modal"
import { fillArea } from "../ui/helpers"
import { styled } from "../ui/styled"
import ChannelDescription from "./ChannelDescription"
import ChannelHeader from "./ChannelHeader"
import ChannelMenu from "./ChannelMenu"
import { Channel } from "./types"

type Props = {
  channel: Channel
  identity: string
  characterStore: CharacterStore
}

function ChannelRoom({ channel, identity, characterStore }: Props) {
  const [menuVisible, menuActions] = useToggle()
  const [descriptionVisible, descriptionActions] = useToggle()

  const users = [...channel.users].map(characterStore.get)

  const header = (
    <ChannelHeader
      title={channel.name}
      onShowChannelMenu={menuActions.toggle}
      onShowDescription={descriptionActions.toggle}
    />
  )

  const body = (
    <BodyContainer>
      <MessageList
        messages={channel.messages}
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
    </BodyContainer>
  )

  const footer = (
    <Observer>
      {() => (
        <Chatbox
          value={channel.input}
          placeholder={`Chatting as ${identity}...`}
          onValueChange={(value) => (channel.input = value)}
          onSubmit={(text) => console.log(`submitted: ${text}`)}
        />
      )}
    </Observer>
  )

  const sidebar = <RoomUserList users={users} />

  return (
    <>
      <RoomLayout
        header={header}
        body={body}
        footer={footer}
        sidebar={sidebar}
      />
      <Drawer side="right" visible={menuVisible} onClose={menuActions.disable}>
        <ChannelMenuContainer>
          <ChannelMenu users={users} />
        </ChannelMenuContainer>
      </Drawer>
    </>
  )
}

export default observer(ChannelRoom)

const BodyContainer = styled.div`
  ${fillArea};
  position: relative;
`

const ChannelMenuContainer = styled.div`
  width: 200px;
  height: 100%;
`
