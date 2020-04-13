import React, { useMemo } from "react"
import tw from "twin.macro"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import { fadedButton, headerText2 } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import MenuItem from "../ui/MenuItem"
import Popover, { PopoverState } from "../ui/Popover"
import { screenQueries } from "../ui/screens"
import ChannelFilters from "./ChannelFilters"
import { ChannelState } from "./ChannelState"

type Props = {
  channel: ChannelState
  onToggleDescription: () => void
  onShowUsers: () => void
} & TagProps<"header">

function ChannelHeader({
  channel,
  onToggleDescription,
  onShowUsers,
  ...props
}: Props) {
  const isLargeScreen = useMediaQuery(screenQueries.large)
  const menuState = useMemo(() => new PopoverState(), [])

  function showMenu(event: React.MouseEvent<HTMLButtonElement>) {
    const target = event.currentTarget
    menuState.showAt({
      x: target.offsetLeft,
      y: target.offsetTop + target.clientHeight,
    })
  }

  return (
    <header css={tw`flex flex-row items-center p-3 bg-background-0`} {...props}>
      <ChatMenuButton css={tw`mr-3`} />

      <Button
        title="Description"
        css={[fadedButton]}
        onClick={onToggleDescription}
      >
        <Icon which={icons.about} />
      </Button>

      <div css={tw`w-3`} />

      <h1 css={[headerText2, tw`flex-1`]}>{channel.title}</h1>

      {isLargeScreen && <ChannelFilters channel={channel} />}

      {!isLargeScreen && (
        <>
          <div css={tw`w-3`} />

          <Button title="User list" css={fadedButton} onClick={onShowUsers}>
            <Icon which={icons.users} />
          </Button>
        </>
      )}

      <div css={tw`w-3`} />

      <Button title="More" css={fadedButton} onClick={showMenu}>
        <Icon which={icons.more} />
      </Button>

      <Popover state={menuState} css={tw`w-56`}>
        <div css={tw`flex flex-col`} onClick={menuState.hide}>
          <MenuItem
            text="Clear messages"
            icon={icons.clearMessages}
            onClick={channel.messageList.clear}
          />
          <MenuItem
            text="Copy code"
            icon={icons.code}
            onClick={() => {
              window.navigator.clipboard.writeText(channel.linkCode)
            }}
          />
          <MenuItem
            text="Invite"
            icon={icons.heart}
            onClick={() => {
              // todo
            }}
          />
        </div>
      </Popover>
    </header>
  )
}

export default ChannelHeader
