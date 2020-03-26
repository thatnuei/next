import React from "react"
import tw from "twin.macro"
import { range } from "../common/range"
import Button from "../dom/Button"
import { TagProps } from "../jsx/types"
import { input, solidButton } from "../ui/components"
import { scrollVertical } from "../ui/helpers"
import Icon from "../ui/Icon"
import { refresh, sortAlphabetical } from "../ui/icons"
import ChannelBrowserItem from "./ChannelBrowserItem"

type Props = TagProps<"div">

function ChannelBrowser(props: Props) {
  return (
    <div css={tw`flex flex-col w-full h-full`} {...props}>
      <main css={[tw`flex-1 flex flex-col bg-background-1`, scrollVertical]}>
        {range(20).map((i) => (
          <ChannelBrowserItem
            key={i}
            name={`insert channel name here`}
            userCount={Math.floor(Math.random() * 2000)}
            isActive={i % 10 === 0}
          />
        ))}
      </main>

      <footer css={tw`flex flex-row p-2 bg-background-0`}>
        <input
          type="text"
          aria-label="Search"
          placeholder="Search..."
          css={[input, tw`flex-1`]}
        />
        <Button title="Sort" css={[solidButton, tw`ml-2`]}>
          <Icon which={sortAlphabetical} />
        </Button>
        <Button title="Refresh" css={[solidButton, tw`ml-2`]}>
          <Icon which={refresh} />
        </Button>
      </footer>
    </div>
  )
}

export default ChannelBrowser
