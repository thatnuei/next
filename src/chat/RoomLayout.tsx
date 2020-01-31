import React from "react"
import {
  fillArea,
  flexColumn,
  flexGrow,
  flexRow,
  spacedChildrenHorizontal,
  spacedChildrenVertical,
} from "../ui/helpers"
import { spacing } from "../ui/theme"

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
      {props.sidebar}
    </div>
  )
}

export default RoomLayout
