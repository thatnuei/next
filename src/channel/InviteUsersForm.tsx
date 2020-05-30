import fuzzysearch from "fuzzysearch"
import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import tw from "twin.macro"
import CharacterName from "../character/CharacterName"
import { CharacterState } from "../character/CharacterState"
import { useChatState } from "../chat/chatStateContext"
import { InputState } from "../form/InputState"
import TextInput from "../form/TextInput"
import { compare } from "../helpers/common/compare"
import { unique } from "../helpers/common/unique"
import { useSocket } from "../socket/socketContext"
import { fadedButton, input } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import VirtualizedList, { RenderItemInfo } from "../ui/VirtualizedList"
import { ChannelState } from "./ChannelState"

type Props = { channel: ChannelState }

const byLower = compare((it: string) => it.toLowerCase())

const byName = compare((it: CharacterState) => it.name.toLowerCase())

function InviteUsersForm({ channel }: Props) {
  const state = useChatState()
  const socket = useSocket()
  const searchInput = useMemo(() => new InputState(""), [])

  const matchesQuery = (it: CharacterState) =>
    fuzzysearch(searchInput.value.toLowerCase(), it.name.toLowerCase())

  const byGroupOrder = compare((it: CharacterState) => {
    if (state.isFriend(it.name)) return 1
    if (state.bookmarks.has(it.name)) return 2
    return 3
  })

  const users = (() => {
    const searchQuery = searchInput.value.toLowerCase().trim()

    if (!searchQuery) {
      const friendNames = [...state.friends].map((it) => it.them).sort(byLower)

      const bookmarkNames = [...state.bookmarks].sort(byLower)

      return [...friendNames, ...bookmarkNames]
        .map(state.characters.get)
        .filter((char) => char.status !== "offline")
        .filter(matchesQuery)
    }

    return [...state.characters.values()]
      .filter(matchesQuery)
      .sort(byName)
      .sort(byGroupOrder)
  })()

  const sendInvite = (name: string) => {
    // untested lol!
    socket.send({
      type: "CIU",
      params: { channel: channel.id, character: name },
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
          items={unique(users, (user) => user.name)}
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
