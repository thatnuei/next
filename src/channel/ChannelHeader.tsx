import { AnimatePresence } from "framer-motion"
import { useObservable } from "micro-observables"
import React from "react"
import tw from "twin.macro"
import { useIdentity } from "../app/helpers"
import ChatMenuButton from "../chatNav/ChatMenuButton"
import Button from "../dom/Button"
import { useMediaQuery } from "../dom/useMediaQuery"
import { TagProps } from "../jsx/types"
import { fadedButton, headerText2 } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import MenuItem from "../ui/MenuItem"
import Modal from "../ui/Modal"
import { useOverlay } from "../ui/overlay"
import Popover, { usePopover } from "../ui/Popover"
import { screenQueries } from "../ui/screens"
import ChannelFilters from "./ChannelFilters"
import { useChannel } from "./helpers"
import InviteUsersForm from "./InviteUsersForm"

type Props = {
  channelId: string
  onToggleDescription: () => void
  onShowUsers: () => void
} & TagProps<"header">

function ChannelHeader({
  channelId,
  onToggleDescription,
  onShowUsers,
  ...props
}: Props) {
  const channel = useChannel(channelId)
  const title = useObservable(channel.title)
  const isPublic = useObservable(channel.isPublic)
  const ops = useObservable(channel.ops)

  const identity = useIdentity()

  const isLargeScreen = useMediaQuery(screenQueries.large)
  const menu = usePopover()
  const invite = useOverlay()

  const shouldShowInviteOption = isPublic && ops.includes(identity)

  function showMenu(event: React.MouseEvent<HTMLButtonElement>) {
    const target = event.currentTarget
    menu.showAt({
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

      <h1 css={[headerText2, tw`flex-1`]}>{title}</h1>

      {isLargeScreen && <ChannelFilters channelId={channel.id} />}

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

      <Popover {...menu.props} css={tw`w-48 bg-background-2`}>
        {!isLargeScreen && (
          <ChannelFilters
            channelId={channel.id}
            css={tw`px-3 py-2 bg-background-0 mb-gap`}
          />
        )}
        <div css={tw`flex flex-col bg-background-1`}>
          <MenuItem
            text="Copy code"
            icon={icons.code}
            onClick={() => {
              window.navigator.clipboard
                .writeText(channel.linkCode.get())
                .catch(console.error)
              menu.hide()
            }}
          />
          <MenuItem
            text="Clear messages"
            icon={icons.clearMessages}
            onClick={() => {
              channel.clearMessages()
              menu.hide()
            }}
          />
          {shouldShowInviteOption && (
            <MenuItem
              text="Invite"
              icon={icons.invite}
              onClick={() => {
                invite.show()
                menu.hide()
              }}
            />
          )}
        </div>
      </Popover>

      <AnimatePresence>
        {invite.value && (
          <Modal
            onDismiss={invite.hide}
            title={`Invite to ${title}`}
            width={400}
            height={700}
          >
            <InviteUsersForm channelId={channelId} />
          </Modal>
        )}
      </AnimatePresence>
    </header>
  )
}

export default ChannelHeader
