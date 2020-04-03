import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { CharacterModel } from "../character/CharacterModel"
import CharacterName from "../character/CharacterName"
import { useChatContext } from "../chat/context"
import { compare } from "../common/compare"
import { ValueOf } from "../common/types"
import { TagProps } from "../jsx/types"
import VirtualizedList from "../ui/VirtualizedList"
import { ChannelModel } from "./ChannelModel"

type Props = TagProps<"div"> & {
  channel: ChannelModel
}

const itemTypes = ["admin", "op", "friend", "looking", "default"] as const
type ItemType = ValueOf<typeof itemTypes>

function ChannelUserList({ channel, ...props }: Props) {
  const { state } = useChatContext()

  const getItemType = (character: CharacterModel): ItemType => {
    if (state.admins.has(character.name)) return "admin"
    if (channel.ops.has(character.name)) return "op"
    if (state.friends.has(character.name)) return "friend"
    if (character.status === "looking") return "looking"
    return "default"
  }

  const getTypeCss = (type: ItemType) => {
    if (type === "admin") return tw`bg-red-faded`
    if (type === "op") return tw`bg-yellow-faded`
    if (type === "friend") return tw`bg-blue-faded`
  }

  const { characters } = channel.users

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
