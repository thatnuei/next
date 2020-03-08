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
    <div {...props}>
      <main>
        {range(20).map((i) => (
          <ChannelBrowserItem
            name={`insert channel name here`}
            userCount={Math.floor(Math.random() * 2000)}
            isActive={i % 10 === 0}
          />
        ))}
      </main>

      <footer>
        <input type="text" placeholder="Search..." />
        <Button>
          <Icon which={sortAlphabetical} />
        </Button>
        <Button>
          <Icon which={refresh} />
        </Button>
      </footer>
    </div>
  );
}

export default ChannelBrowser
