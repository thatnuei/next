import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import tw from "twin.macro"
import BBC from "../bbc/BBC"
import ChatInput from "../chat/ChatInput"
import { useChatStream } from "../chat/streamContext"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import MessageList from "../message/MessageList"
import { fadedButton, headerText2 } from "../ui/components"
import Drawer from "../ui/Drawer"
import { scrollVertical } from "../ui/helpers"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import Modal from "../ui/Modal"
import { OverlayModel } from "../ui/OverlayModel"
import { screenQueries } from "../ui/screens"
import ChannelFilters from "./ChannelFilters"
import ChannelUserList from "./ChannelUserList"
import { ChannelModel } from "./state"

type Props = {
  channel: ChannelModel
} & TagProps<"div">

function ChannelView({ channel, ...props }: Props) {
  const stream = useChatStream()
  const isLargeScreen = useMediaQuery(screenQueries.large)
  const descriptionOverlay = useMemo(() => new OverlayModel(), [])
  const mobileDrawer = useMemo(() => new OverlayModel(), [])

  return (
    <div css={tw`flex flex-col`} {...props}>
      <header css={tw`flex flex-row items-center p-3 bg-background-0`}>
        <ChatMenuButton css={tw`mr-3`} />

        <Button
          title="Description"
          css={[fadedButton, tw`flex flex-row flex-shrink-0`]}
          onClick={descriptionOverlay.toggle}
        >
          <Icon which={icons.about} />
        </Button>

        <div css={tw`w-3`} />

        <h1 css={headerText2}>{channel.title}</h1>

        <div css={tw`flex-1`} />

        {isLargeScreen && <ChannelFilters channel={channel} />}

        {!isLargeScreen && (
          <Button
            title="More"
            css={[fadedButton, tw`ml-3`]}
            onClick={mobileDrawer.show}
          >
            <Icon which={icons.users} />
          </Button>
        )}
      </header>

      <div css={tw`flex flex-row flex-1 min-h-0 my-gap`}>
        <main css={tw`relative flex-1 bg-background-1`}>
          <MessageList
            list={channel.messageList}
            filter={(it) => channel.shouldShowMessage(it.type)}
            css={tw`w-full h-full`}
          />
          <Modal
            title="Description"
            width="100%"
            height="max(60%, 500px)"
            model={descriptionOverlay}
            fillMode="absolute"
            verticalPanelAlign="top"
          >
            <div css={[tw`w-full h-full`, scrollVertical]}>
              <p css={tw`p-4`}>
                <BBC text={channel.description} />
              </p>
            </div>
          </Modal>
        </main>

        {isLargeScreen && (
          <ChannelUserList channel={channel} css={tw`w-56 min-h-0 ml-gap`} />
        )}
      </div>

      <ChatInput
        inputModel={channel.chatInput}
        onSubmit={(text) =>
          stream.send({
            type: "send-channel-message",
            channelId: channel.id,
            text,
          })
        }
      />

      {!isLargeScreen && (
        <Drawer model={mobileDrawer} side="right">
          <div css={tw`flex flex-col h-full bg-background-2`}>
            <ChannelUserList channel={channel} css={tw`flex-1 w-56`} />
            <div css={tw`h-gap`} />
            <ChannelFilters channel={channel} css={tw`p-2 bg-background-0`} />
          </div>
        </Drawer>
      )}
    </div>
  )
}

export default observer(ChannelView)
