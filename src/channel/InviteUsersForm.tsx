import { uniqBy } from "lodash/fp"
import React, { useMemo } from "react"
import { useRecoilValue } from "recoil"
import tw from "twin.macro"
import { CharacterModel } from "../character/CharacterModel"
import CharacterName from "../character/CharacterName"
import {
  bookmarksAtom,
  friendsAtom,
  useCharacterList,
} from "../character/state"
import { useSocket } from "../socket/socketContext"
import { fadedButton } from "../ui/components"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import VirtualizedList, { RenderItemInfo } from "../ui/VirtualizedList"

type Props = { channelId: string }

// need to have a list of all online character names in order to make them searchable,
// do that later
function InviteUsersForm({ channelId }: Props) {
  const socket = useSocket()

  // const [searchInput, setSearchInput] = useState("")

  const friends = useRecoilValue(friendsAtom)
  const bookmarks = useRecoilValue(bookmarksAtom)

  const characterNames = useMemo(
    () => [...friends.map((it) => it.them), ...bookmarks],
    [bookmarks, friends],
  )

  const characters = useCharacterList(characterNames)

  // const matchesQuery = (it: CharacterState) =>
  //   fuzzysearch(searchInput.toLowerCase(), it.name.toLowerCase())

  // const getGroupOrder = (it: CharacterState) => {
  //   if (isFriend(friends)(it.name)) return 1
  //   if (bookmarks.includes(it.name)) return 2
  //   return 3
  // }

  // const users = (() => {
  //   const searchQuery = searchInput.toLowerCase().trim()

  //   if (!searchQuery) {
  //     const friendNames = sortBy(
  //       toLower,
  //       friends.map((it) => it.them),
  //     )

  //     const bookmarkNames = sortBy(toLower, bookmarks)

  //     return [...friendNames, ...bookmarkNames]
  //       .map(state.characters.get)
  //       .filter((char) => char.status !== "offline")
  //       .filter(matchesQuery)
  //   }

  //   return sortBy(
  //     [getGroupOrder, (it) => it.name.toLowerCase()],
  //     [...state.characters.values()].filter(matchesQuery),
  //   )
  // })()

  const sendInvite = (name: string) => {
    // untested lol!
    socket.send({
      type: "CIU",
      params: { channel: channelId, character: name },
    })
  }

  const renderItem = ({ item, style }: RenderItemInfo<CharacterModel>) => (
    <div css={tw`flex flex-row items-center px-3 py-2`} style={style}>
      <CharacterName name={item.name.get()} tw="flex-1" />
      <button
        css={[fadedButton, tw`flex flex-row ml-2`]}
        onClick={() => sendInvite(item.name.get())}
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
          items={uniqBy((user) => user.name, characters)}
          itemSize={40}
          getItemKey={(it) => it.name.get()}
          renderItem={renderItem}
        />
      </div>
      {/* <div css={tw`m-2`}>
        <TextInput
          value={searchInput}
          onChangeText={setSearchInput}
          type="text"
          css={input}
          placeholder="Search..."
        />
      </div> */}
    </div>
  )
}

export default InviteUsersForm
