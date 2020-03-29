import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import tw from "twin.macro"
import ChannelBrowser from "../channel/ChannelBrowser"
import ChannelView from "../channel/ChannelView"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { fadedButton } from "../ui/components"
import { fixedCover } from "../ui/helpers"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
import { screenQueries } from "../ui/screens"
import ChatInput from "./ChatInput"
import { useChatContext } from "./context"
import NavAction from "./NavAction"
import RoomTab from "./RoomTab"
import UpdateStatus from "./UpdateStatus"
import { useChatNavigation } from "./useChatNavigation"

function Chat() {
  const { identity, channelStore } = useChatContext()

  const { activeChannel, setRoom } = useChatNavigation()

  const isSmallScreen = useMediaQuery(screenQueries.small)

  const [channelBrowserVisible, setChannelBrowserVisible] = useState(false)
  const [updateStatusVisible, setUpdateStatusVisible] = useState(false)

  const menuButton = isSmallScreen && (
    <Button title="Show side menu" css={[fadedButton, tw`mr-3`]}>
      <Icon which={icons.menu} />
    </Button>
  )

  return (
    <div css={[fixedCover, tw`flex`]}>
      {!isSmallScreen && (
        <nav css={tw`flex mr-gap`}>
          <div css={tw`flex flex-col mr-gap`}>
            <NavAction
              icon={icons.list}
              title="Browse channels"
              onClick={() => setChannelBrowserVisible(true)}
            />
            <NavAction
              icon={icons.updateStatus}
              title="Update your status"
              onClick={() => setUpdateStatusVisible(true)}
            />
            <NavAction
              icon={icons.users}
              title="See online friends and bookmarks"
            />
            <NavAction icon={icons.about} title="About next" />
            <div css={tw`flex-1`} />
            <NavAction icon={icons.logout} title="Log out" />
          </div>

          <div css={tw`flex flex-col w-56`}>
            {/* <CharacterDetails
              character={testificate}
              css={tw`p-3 bg-background-0 mb-gap`}
            /> */}
            <div css={tw`flex-1 bg-background-1`}>
              {channelStore.channels.map((channel) => (
                <RoomTab
                  key={channel.id}
                  icon={<Icon which={icons.earth} />}
                  title={channel.title}
                  state={channel === activeChannel ? "active" : "inactive"}
                  onClick={() => setRoom({ type: "channel", id: channel.id })}
                />
              ))}
            </div>
          </div>
        </nav>
      )}

      <div css={tw`flex-1`}>
        {activeChannel && (
          <ChannelView
            channel={activeChannel}
            menuButton={menuButton}
            chatInput={<ChatInput identity={identity} />}
          />
        )}
      </div>

      <Modal
        title="Channels"
        width={480}
        height={720}
        isVisible={channelBrowserVisible}
        onClose={() => setChannelBrowserVisible(false)}
        children={<ChannelBrowser />}
      />

      <Modal
        title="Update Your Status"
        width={480}
        height={360}
        isVisible={updateStatusVisible}
        onClose={() => setUpdateStatusVisible(false)}
        children={
          <UpdateStatus
            initialValues={{ status: "online", statusMessage: "" }}
            onSubmit={(values) => {
              console.log(values)
              setUpdateStatusVisible(false)
            }}
          />
        }
      />
    </div>
  )
}

export default observer(Chat)
