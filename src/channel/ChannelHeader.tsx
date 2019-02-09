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
    const checked = channel.selectedMode === mode
    const handleChange = () => channel.setSelectedMode(mode)

    return (
      <FilterInput checked={checked} onChange={handleChange}>
        {text}
      </FilterInput>
    )
  }

  return (
    <>
      <div css={nameAndFilterStyle}>
        <h2 css={channelNameStyle}>{channel.name}</h2>

        {channel.mode === "chat" && (
          <FilterGroup>
            <FilterInput disabled>Both</FilterInput>
            <FilterInput disabled checked>
              Chat
            </FilterInput>
            <FilterInput disabled>Ads</FilterInput>
          </FilterGroup>
        )}

        {channel.mode === "ads" && (
          <FilterGroup>
            <FilterInput disabled>Both</FilterInput>
            <FilterInput disabled>Chat</FilterInput>
            <FilterInput disabled checked>
              Ads
            </FilterInput>
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

const FilterInput = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"input">) => (
  <label
    css={css`
      display: block;
      padding: 0.5rem;
    `}
  >
    <input
      type="radio"
      name="channel-filter"
      readOnly={props.disabled}
      css={css`
        opacity: 0;
        position: absolute;

        :disabled + span {
          opacity: ${props.checked ? 0.6 : 0.3};
          pointer-events: none;
        }

        :focus + span {
          opacity: 1;
        }
      `}
      {...props}
    />{" "}
    <span
      css={css`
        opacity: ${props.checked ? 0.8 : 0.5};
      `}
    >
      {children}
    </span>
  </label>
)
