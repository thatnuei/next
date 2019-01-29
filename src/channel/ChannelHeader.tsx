import React from "react"
import Button from "../ui/Button"
import { flexGrow, flexRow, flexWrap } from "../ui/helpers"
import Icon from "../ui/Icon"
import { css } from "../ui/styled"
import { Channel, ChannelMode } from "./types"

type Props = {
  channel: Channel
  onModeSelected: (channelId: string, mode: ChannelMode) => void
}

export default function ChannelHeader({ channel, onModeSelected }: Props) {
  return (
    <>
      <div css={nameAndFilterStyle}>
        <h2 css={channelNameStyle}>{channel.name}</h2>

        {channel.mode === "chat" && (
          <FilterGroup disabled>
            <FilterButton>Both</FilterButton>
            <FilterButton active>Chat</FilterButton>
            <FilterButton>Ads</FilterButton>
          </FilterGroup>
        )}

        {channel.mode === "ads" && (
          <FilterGroup disabled>
            <FilterButton>Both</FilterButton>
            <FilterButton>Chat</FilterButton>
            <FilterButton active>Ads</FilterButton>
          </FilterGroup>
        )}

        {channel.mode === "both" && (
          <FilterGroup>
            <FilterButton
              active={channel.selectedMode === "both"}
              onClick={() => onModeSelected(channel.id, "both")}
            >
              Both
            </FilterButton>
            <FilterButton
              active={channel.selectedMode === "chat"}
              onClick={() => onModeSelected(channel.id, "chat")}
            >
              Chat
            </FilterButton>
            <FilterButton
              active={channel.selectedMode === "ads"}
              onClick={() => onModeSelected(channel.id, "ads")}
            >
              Ads
            </FilterButton>
          </FilterGroup>
        )}
      </div>
      <Button flat>
        <Icon icon="users" />
      </Button>
    </>
  )
}

const nameAndFilterStyle = css`
  ${flexGrow};
  ${flexRow};
  ${flexWrap};
  align-items: center;
  padding: 0.5rem;
`

const channelNameStyle = css`
  flex: 1 1 auto;
  padding: 0.1rem 0;
  margin-right: 0.5rem;
`

const FilterGroup = (props: {
  children: React.ReactNode
  disabled?: boolean
}) => (
  <div
    css={css`
      padding: 0.1rem 0;
      margin: -0.5rem;
      ${props.disabled &&
        css`
          opacity: 0.75;
          pointer-events: none;
        `}
    `}
  >
    {props.children}
  </div>
)

const FilterButton = (props: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) => (
  <Button
    flat
    css={css`
      padding: 0.5rem;
      opacity: ${props.active ? 1 : 0.5};
    `}
    onClick={props.onClick}
  >
    {props.children}
  </Button>
)
