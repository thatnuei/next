import { observer } from "mobx-react-lite"
import React from "react"
import { semiBlack } from "../ui/colors"
import FlatButton from "../ui/FlatButton"
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
    const isActive = channel.selectedMode === mode
    const handleActivate = () => channel.setSelectedMode(mode)

    return (
      <FilterInput
        name="channel-filter"
        id={mode}
        checked={isActive}
        onChange={handleActivate}
      >
        {text}
      </FilterInput>
    )
  }

  return (
    <div css={containerStyle}>
      <div css={nameAndFilterStyle}>
        <h2 css={channelNameStyle}>{channel.name}</h2>

        {channel.mode === "chat" && (
          <FilterGroup>
            <FilterInput name="channel-filter" id="both" disabled>
              Both
            </FilterInput>
            <FilterInput name="channel-filter" id="chat" disabled checked>
              Chat
            </FilterInput>
            <FilterInput name="channel-filter" id="ads" disabled>
              Ads
            </FilterInput>
          </FilterGroup>
        )}

        {channel.mode === "ads" && (
          <FilterGroup>
            <FilterInput name="channel-filter" id="both" disabled>
              Both
            </FilterInput>
            <FilterInput name="channel-filter" id="chat" disabled>
              Chat
            </FilterInput>
            <FilterInput name="channel-filter" id="ads" disabled checked>
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

      <FlatButton>
        <Icon icon="users" />
      </FlatButton>
    </div>
  )
}
export default observer(ChannelHeader)

const containerStyle = css`
  ${flexRow};
  align-items: center;
  width: 100%;
  height: 100%;
`

const channelNameStyle = css`
  flex: 1;
  padding: 0.1rem 0;
  margin-right: 0.5rem;
`

const nameAndFilterStyle = css`
  ${flexGrow};
  ${flexRow};
  ${flexWrap};
  align-items: center;
  padding: 0.5rem 0;
`

const FilterGroup = (props: { children: React.ReactNode }) => (
  <div
    css={css`
      display: flex;
      flex-direction: row;
      margin: -0.5rem;
    `}
  >
    {props.children}
  </div>
)

const FilterInput = (props: React.ComponentPropsWithoutRef<"input">) => {
  const { children, id, ...inputProps } = props

  const getLabelStyle = () => {
    if (inputProps.disabled) {
      return css`
        opacity: ${inputProps.checked ? 0.7 : 0.4};
        pointer-events: none;
      `
    }

    if (inputProps.checked) {
      return css`
        opacity: 1;
      `
    }

    return css`
      opacity: 0.5;
      :hover {
        opacity: 0.75;
      }
    `
  }

  return (
    <div>
      <input type="radio" id={id} css={filterInputStyle} {...inputProps} />
      <label htmlFor={id} css={[labelBaseStyle, getLabelStyle()]}>
        {children}
      </label>
    </div>
  )
}

const labelBaseStyle = css`
  display: block;
  padding: 0.5rem;
`

const filterInputStyle = css`
  opacity: 0;
  position: absolute;

  :focus + label {
    background-color: ${semiBlack(0.2)};
  }
`
