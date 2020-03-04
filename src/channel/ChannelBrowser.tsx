import React from "react"
import { range } from "../common/range"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { input, solidButton } from "../ui/components"
import Icon from "../ui/Icon"
import { refresh, sortAlphabetical } from "../ui/icons"
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

type Props = TagProps<"div">

function ChannelBrowser(props: Props) {
  return (
    <div css={[flexColumn, size("full")]} {...props}>
      <main css={[flex1, flexColumn, scrollVertical, themeBgColor(1)]}>
        {range(20).map((i) => (
          <ChannelBrowserItem
            name={`insert channel name here`}
            userCount={Math.floor(Math.random() * 2000)}
            isActive={i % 10 === 0}
          />
        ))}
      </main>

      <footer css={[flexRow, p(2), themeBgColor(0)]}>
        <input type="text" placeholder="Search..." css={[input, flex1]} />
        <Button css={[solidButton, ml(2)]}>
          <Icon which={sortAlphabetical} />
        </Button>
        <Button css={[solidButton, ml(2)]}>
          <Icon which={refresh} />
        </Button>
      </footer>
    </div>
  )
}

export default ChannelBrowser
