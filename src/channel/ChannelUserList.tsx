import clsx from "clsx"
import { sortBy } from "lodash-es"
import { memo } from "react"
import CharacterName from "../character/CharacterName"
import { useGetNickname } from "../character/nicknames"
import type { Character } from "../character/types"
import { useCharacterList } from "../character/useCharacterList"
import { useChatContext } from "../chat/ChatContext"
import type { ValueOf } from "../common/types"
import { useStoreValue } from "../state/store"
import VirtualizedList from "../ui/VirtualizedList"
import { useChannelKeys } from "./useChannelKeys"

type Props = {
  channelId: string
}

type ListItem = {
  character: Character
  type: ItemType
}

const itemTypes = ["friend", "bookmark", "admin", "op", "looking", "default"]
type ItemType = ValueOf<typeof itemTypes>

const itemTypeSortOrders = new Map<string, number>(
  [...itemTypes.entries()].map(([order, type]) => [type, Number(order)]),
)

function ChannelUserList({ channelId }: Props) {
  const context = useChatContext()
  const admins = useStoreValue(context.characterStore.admins)
  const channel = useChannelKeys(channelId, ["ops", "users"])
  const characters = useCharacterList(Object.keys(channel.users))
  const getNickname = useGetNickname()

  const friendships = useStoreValue(
    context.characterStore.friendships.select((friendships) =>
      friendships.map((f) => f.them),
    ),
  )

  const bookmarks = useStoreValue(context.characterStore.bookmarks.selectKeys())

  const getType = (character: Character): ItemType => {
    if (admins[character.name]) return "admin"
    if (channel.ops[character.name]) return "op"
    if (friendships.includes(character.name)) return "friend"
    if (bookmarks.includes(character.name)) return "bookmark"
    if (character.status === "looking") return "looking"
    return "default"
  }

  const getTypeClass = (type: ItemType) => {
    switch (type) {
      case "admin":
        return `bg-red-500 bg-opacity-20`
      case "op":
        return `bg-yellow-500 bg-opacity-20`
      case "friend":
        return `bg-green-500 bg-opacity-20`
      case "bookmark":
        return `bg-blue-500 bg-opacity-20`
    }
    return ""
  }

  const items = characters.map(
    (character): ListItem => ({
      character,
      type: getType(character),
    }),
  )

  const sortedItems = sortBy(items, [
    (it) => itemTypeSortOrders.get(it.type),
    (it) => (getNickname(it.character.name) || it.character.name).toLowerCase(),
  ])

  return (
    <div className={`flex flex-col h-full`}>
      <div className={`px-3 py-2 bg-midnight-0`}>
        Characters: {characters.length}
      </div>
      <div className={`flex-1 min-h-0 bg-midnight-1`} role="list">
        <VirtualizedList
          items={sortedItems}
          itemSize={32}
          getItemKey={(item) => item.character.name}
          renderItem={({ item, style }) => (
            <div
              role="listitem"
              style={style}
              className={clsx(
                `flex items-center px-2`,
                getTypeClass(item.type),
              )}
            >
              <CharacterName name={item.character.name} />
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default memo(ChannelUserList)
