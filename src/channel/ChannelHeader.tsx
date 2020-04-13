import React from "react"
import tw from "twin.macro"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import { fadedButton, headerText2 } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
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

      <Button title="More" css={fadedButton}>
        <Icon which={icons.more} />
      </Button>
    </header>
  )
}

export default ChannelHeader
