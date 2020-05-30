import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import CharacterName from "../character/CharacterName"
import { CharacterState } from "../character/CharacterState"
import { useChatState } from "../chat/chatStateContext"
import { compare } from "../helpers/common/compare"
import { ValueOf } from "../helpers/common/types"
import { TagProps } from "../jsx/types"
import VirtualizedList from "../ui/VirtualizedList"
import { ChannelState } from "./ChannelState"

type Props = TagProps<"div"> & {
  channel: ChannelState
}

const itemTypes = [
  "friend",
  "bookmark",
  "admin",
  "op",
  "looking",
  "default",
] as const
type ItemType = ValueOf<typeof itemTypes>

function ChannelUserList({ channel, ...props }: Props) {
  const state = useChatState()

  const getItemType = (character: CharacterState): ItemType => {
    if (state.admins.has(character.name)) return "admin"
    if (channel.ops.has(character.name)) return "op"
    if (state.isFriend(character.name)) return "friend"
    if (state.bookmarks.has(character.name)) return "bookmark"
    if (character.status === "looking") return "looking"
    return "default"
  }

  const getTypeCss = (type: ItemType) => {
    if (type === "admin") return tw`bg-red-faded`
    if (type === "op") return tw`bg-yellow-faded`
    if (type === "friend") return tw`bg-green-faded`
    if (type === "bookmark") return tw`bg-blue-faded`
  }

  const characters = [...channel.users].map(state.characters.get)

  const listItems = characters.map((character) => {
    const type = getItemType(character)
    return {
      character,
      type,
      order: itemTypes.indexOf(type),
      css: getTypeCss(type),
    }
  })

  const sortedItems = listItems
    .sort(compare((it) => it.character.name.toLowerCase()))
    .sort(compare((it) => it.order))

  return (
    <div css={tw`flex flex-col`} {...props}>
      <div css={tw`px-3 py-2 bg-background-0`}>
        Characters: {characters.length}
      </div>
      <div css={tw`flex-1 min-h-0 bg-background-1`} role="list">
        <VirtualizedList
          items={sortedItems}
          itemSize={32}
          getItemKey={(item) => item.character.name}
          renderItem={({ item, style }) => (
            <CharacterName
              role="listitem"
              character={item.character}
              style={style}
              css={[tw`flex items-center px-2`, item.css]}
            />
          )}
        />
      </div>
    </div>
  )
}

export default observer(ChannelUserList)
