import { observer, Observer } from "mobx-react-lite"
import React from "react"
import { CharacterStore } from "../character/CharacterStore"
import Chatbox from "../chat/Chatbox"
import RoomLayout from "../chat/RoomLayout"
import RoomUserList from "../chat/RoomUserList"
import MessageList from "../message/MessageList"
import { useToggle } from "../state/hooks/useToggle"
import Drawer from "../ui/components/Drawer"
import Modal from "../ui/components/Modal"
import { fillArea } from "../ui/helpers"
import { styled } from "../ui/styled"
import ChannelDescription from "./ChannelDescription"
import ChannelHeader from "./ChannelHeader"
import ChannelMenu from "./ChannelMenu"
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
    </BodyContainer>
  )

  const footer = (
    <Observer>
      {() => (
        <Chatbox
          value={channel.room.input}
          placeholder={`Chatting as ${identity}...`}
          onValueChange={channel.room.setInput}
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
