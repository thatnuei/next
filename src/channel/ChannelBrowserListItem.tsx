import React from "react"
import Icon, { IconName } from "../ui/components/Icon"
import { fillArea, spacedChildrenHorizontal } from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import { ChannelBrowserEntry } from "./types"

type Props = {
  entry: ChannelBrowserEntry
  icon: IconName
}

export default function ChannelBrowserListItem({ entry, icon }: Props) {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
  }

  return (
    <Container href="#" onClick={handleClick}>
      <Icon icon={icon} />
      <Title dangerouslySetInnerHTML={{ __html: entry.title }} />
      <UserCount>{entry.userCount}</UserCount>
    </Container>
  )
}

const Container = styled.a`
  display: flex;
  align-items: center;
  padding: ${spacing.xsmall} ${spacing.small};
  ${spacedChildrenHorizontal(spacing.xsmall)};
  ${fillArea};
`

const Title = styled.div`
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const UserCount = styled.div``
