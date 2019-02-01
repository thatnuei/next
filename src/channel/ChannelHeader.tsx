import { observer } from "mobx-react-lite"
import React, { useContext } from "react"
import ChatStore from "../chat/ChatStore"
import Button from "../ui/Button"
import { flexGrow, flexRow, flexWrap } from "../ui/helpers"
import Icon from "../ui/Icon"
import { css } from "../ui/styled"
import { ChannelMode } from "./types"

type Props = {
  channelId: string
}

function ChannelHeader({ channelId }: Props) {
  const { channelStore } = useContext(ChatStore.Context)
  const channel = channelStore.channels.get(channelId)

  function renderFilterButton(mode: ChannelMode, text: string) {
    const active = channel.selectedMode === mode
    const handleClick = () => channelStore.setSelectedMode(channelId, mode)
    return (
      <FilterButton active={active} onClick={handleClick}>
        {text}
      </FilterButton>
    )
  }

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
            {renderFilterButton("both", "Both")}
            {renderFilterButton("chat", "Chat")}
            {renderFilterButton("ads", "Ads")}
          </FilterGroup>
        )}
      </div>

      <Button flat>
        <Icon icon="users" />
      </Button>
    </>
  )
}
export default observer(ChannelHeader)

const nameAndFilterStyle = css`
  ${flexGrow};
  ${flexRow};
  ${flexWrap};
  align-items: center;
  padding: 0.5rem 0;
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
