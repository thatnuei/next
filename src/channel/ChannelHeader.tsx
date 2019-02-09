import { observer } from "mobx-react-lite"
import React from "react"
import Button from "../ui/Button"
import { flexGrow, flexRow, flexWrap } from "../ui/helpers"
import Icon from "../ui/Icon"
import { css } from "../ui/styled"
import ChannelModel from "./ChannelModel"
import { ChannelMode } from "./types"

type Props = {
  channel: ChannelModel
}

function ChannelHeader({ channel }: Props) {
  function renderFilterButton(mode: ChannelMode, text: string) {
    const active = channel.selectedMode === mode
    const handleClick = () => channel.setSelectedMode(mode)

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
          <FilterGroup>
            <FilterButton disabled>Both</FilterButton>
            <FilterButton disabled active>
              Chat
            </FilterButton>
            <FilterButton disabled>Ads</FilterButton>
          </FilterGroup>
        )}

        {channel.mode === "ads" && (
          <FilterGroup>
            <FilterButton disabled>Both</FilterButton>
            <FilterButton disabled>Chat</FilterButton>
            <FilterButton disabled active>
              Ads
            </FilterButton>
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

const FilterGroup = (props: { children: React.ReactNode }) => (
  <div
    css={css`
      display: flex;
      flex-direction: row;
      padding: 0.1rem 0;
      margin: -0.5rem;
    `}
  >
    {props.children}
  </div>
)

const FilterButton = ({
  active,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button> & { active?: boolean }) => (
  <Button
    flat
    css={css`
      padding: 0.5rem;
      ${getActiveStyle({ active, ...props })}
    `}
    {...props}
  />
)

const getActiveStyle = ({ active = false, disabled = false }) => {
  if (disabled) {
    return css`
      opacity: ${active ? 0.6 : 0.3};
      pointer-events: none;
    `
  }

  return active
    ? css`
        opacity: 1;
      `
    : css`
        opacity: 0.5;
        :hover {
          opacity: 0.75;
        }
      `
}
