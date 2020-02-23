import React from "react"
import { range } from "../common/range"
import Button from "../dom/Button"
import { input, solidButton } from "../ui/components"
import Icon from "../ui/Icon"
import {
  flex1,
  flexColumn,
  flexRow,
  ml,
  p,
  scrollVertical,
  size,
  themeBgColor,
} from "../ui/style"
import ChannelBrowserItem from "./ChannelBrowserItem"

type Props = {}

function ChannelBrowser(props: Props) {
  return (
    <div css={[size("full"), flexColumn]}>
      <div css={[flex1, flexColumn, scrollVertical, themeBgColor(2)]}>
        {range(20).map((i) => (
          <ChannelBrowserItem
            name={`room ${i}`}
            userCount={Math.floor(Math.random() * 2000)}
            isActive={i % 10 === 0}
          />
        ))}
      </div>

      <div css={[flexRow, p(2)]}>
        <input type="text" placeholder="Search..." css={[input, flex1]} />
        <Button css={[solidButton, ml(2)]}>
          <Icon name="sortAlphabetical" />
        </Button>
        <Button css={[solidButton, ml(2)]}>
          <Icon name="refresh" />
        </Button>
      </div>
    </div>
  )
}

export default ChannelBrowser
