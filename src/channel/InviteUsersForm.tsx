import fuzzysearch from "fuzzysearch"
import { sortBy, toLower, uniqBy } from "lodash/fp"
import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import { useRecoilValue } from "recoil"
import tw from "twin.macro"
import CharacterName from "../character/CharacterName"
import { CharacterState } from "../character/CharacterState"
import { bookmarksAtom, friendsAtom, isFriend } from "../character/state"
import { useChatState } from "../chat/chatStateContext"
import { InputState } from "../form/InputState"
import TextInput from "../form/TextInput"
import { useSocket } from "../socket/socketContext"
import { fadedButton, input } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import VirtualizedList, { RenderItemInfo } from "../ui/VirtualizedList"

type Props = { channelId: string }

function InviteUsersForm({ channelId }: Props) {
  const state = useChatState()
  const socket = useSocket()
  const searchInput = useMemo(() => new InputState(""), [])
  const friends = useRecoilValue(friendsAtom)
  const bookmarks = useRecoilValue(bookmarksAtom)

  const matchesQuery = (it: CharacterState) =>
    fuzzysearch(searchInput.value.toLowerCase(), it.name.toLowerCase())

  const getGroupOrder = (it: CharacterState) => {
    if (isFriend(friends)(it.name)) return 1
    if (bookmarks.includes(it.name)) return 2
    return 3
  }

  const users = (() => {
    const searchQuery = searchInput.value.toLowerCase().trim()

    if (!searchQuery) {
      const friendNames = sortBy(
        toLower,
        friends.map((it) => it.them),
      )

      const bookmarkNames = sortBy(toLower, bookmarks)

      return [...friendNames, ...bookmarkNames]
        .map(state.characters.get)
        .filter((char) => char.status !== "offline")
        .filter(matchesQuery)
    }

    return sortBy(
      [getGroupOrder, (it) => it.name.toLowerCase()],
      [...state.characters.values()].filter(matchesQuery),
    )
  })()

  const sendInvite = (name: string) => {
    // untested lol!
    socket.send({
      type: "CIU",
      params: { channel: channelId, character: name },
    })
  }

  const renderItem = ({ item, style }: RenderItemInfo<CharacterState>) => (
    <div css={tw`flex flex-row items-center px-3 py-2`} style={style}>
      <CharacterName character={item} tw="flex-1" />
      <button
        css={[fadedButton, tw`flex flex-row ml-2`]}
        onClick={() => sendInvite(item.name)}
      >
        <Icon which={icons.invite} />
        <span css={tw`ml-2`}>Invite</span>
      </button>
    </div>
  )

  return (
    <div css={tw`flex flex-col w-full h-full`}>
      <div css={tw`flex-1 bg-background-2`}>
        <VirtualizedList
          items={uniqBy((user) => user.name, users)}
          itemSize={40}
          getItemKey={(it) => it.name}
          renderItem={renderItem}
        />
      </div>
      <div css={tw`m-2`}>
        <TextInput
          state={searchInput}
          type="text"
          css={input}
          placeholder="Search..."
        />
      </div>
    </div>
  )
}

export default observer(InviteUsersForm)
