import React from "react"
import Button from "../ui/Button"
import { flexGrow, flexRow, flexWrap } from "../ui/helpers"
import Icon from "../ui/Icon"
import { css, styled } from "../ui/styled"
import { Channel } from "./types"

type Props = {
  channel: Channel
}

export default function ChannelHeader({ channel }: Props) {
  return (
    <>
      <div css={nameAndFilterStyle}>
        <h2 css={channelNameStyle}>{channel.name}</h2>
        <div css={filterGroupStyle}>
          <FilterButton flat>Both</FilterButton>
          <FilterButton flat>Chat</FilterButton>
          <FilterButton flat>Ads</FilterButton>
        </div>
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

const filterGroupStyle = css`
  padding: 0.1rem 0;
  margin: -0.5rem;
`

const FilterButton = styled(Button)`
  padding: 0.5rem;
`
