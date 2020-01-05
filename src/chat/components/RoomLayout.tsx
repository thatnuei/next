import React from "react"
import {
  fillArea,
  flexColumn,
  flexGrow,
  flexRow,
  spacedChildrenHorizontal,
  spacedChildrenVertical,
} from "../../ui/helpers"
import { css } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import { roomSidebarBreakpoint } from "../constants"

type Props = {
  header: React.ReactNode
  body: React.ReactNode
  footer: React.ReactNode
  sidebar?: React.ReactNode
}

function RoomLayout(props: Props) {
  return (
    <div css={[fillArea, flexRow, spacedChildrenHorizontal(spacing.xsmall)]}>
      <div css={[flexGrow, flexColumn, spacedChildrenVertical(spacing.xsmall)]}>
        {props.header}
        <div css={[flexGrow]}>{props.body}</div>
        {props.footer}
      </div>
      <div css={[sidebarBasis, sidebarMedia]}>{props.sidebar}</div>
    </div>
  )
}

export default RoomLayout

const sidebarBasis = css`
  flex-basis: 220px;
`

const sidebarMedia = css`
  @media (max-width: ${roomSidebarBreakpoint}px) {
    display: none;
  }
`
