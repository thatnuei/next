import React, { useMemo, useState } from "react"
import { useRecoilValue } from "recoil"
import tw from "twin.macro"
import { useChatState } from "../chat/chatStateContext"
import { useChatStream } from "../chat/streamContext"
import { useWindowEvent } from "../dom/useWindowEvent"
import { getProfileUrl } from "../flist/helpers"
import { factoryFrom } from "../helpers/common/factoryFrom"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import MenuItem from "../ui/MenuItem"
import Popover, { PopoverState } from "../ui/Popover"
import CharacterMemoInput from "./CharacterMemoInput"
import { CharacterState } from "./CharacterState"
import CharacterSummary from "./CharacterSummary"
import { bookmarksAtom, friendsAtom, ignoredAtom } from "./state"

function CharacterMenu() {
  const chatState = useChatState()
  const chatStream = useChatStream()
  const bookmarks = useRecoilValue(bookmarksAtom)
  const ignored = useRecoilValue(ignoredAtom)
  const friends = useRecoilValue(friendsAtom)

  const popover = useMemo(factoryFrom(PopoverState), [])
  const [character, setCharacter] = useState<CharacterState | undefined>()

  function handleClick(event: MouseEvent) {
    const characterName = (() => {
      for (const target of event.composedPath()) {
        if (target instanceof HTMLElement && target.dataset.character) {
          return target.dataset.character
        }
      }
    })()

    if (characterName) {
      setCharacter(chatState.characters.get(characterName))
      popover.showAt({ x: event.clientX, y: event.clientY })
      event.preventDefault()
    }
  }

  useWindowEvent("click", handleClick)

  if (!character) return null

  const isIgnored = ignored.includes(character.name)
  const isBookmarked = bookmarks.includes(character.name)
  const friendshipItems = friends.filter((it) => it.them === character.name)

  return (
    <Popover state={popover} css={tw`w-56`}>
      <div css={tw`p-3 bg-background-0`}>
        <CharacterSummary character={character} />

        {friendshipItems.map((item, index) => (
          <div
            key={index}
            css={tw`flex flex-row items-center px-2 py-1 mt-3 text-sm bg-green-faded text-green`}
          >
            <Icon which={icons.heart} css={tw`w-4 h-4 mr-1`} />
            {item.us}
          </div>
        ))}
      </div>

      <div css={tw`flex flex-col`} onClick={popover.hide}>
        <MenuItem
          icon={icons.link}
          text="Profile"
          href={getProfileUrl(character.name)}
        />
        <MenuItem
          icon={icons.message}
          text="Message"
          onClick={() => {
            chatStream.send({
              type: "open-private-chat",
              name: character.name,
            })
          }}
        />
        <MenuItem
          icon={isBookmarked ? icons.bookmark : icons.bookmarkHollow}
          text={isBookmarked ? "Remove bookmark" : "Bookmark"}
          onClick={() => {
            chatStream.send({
              type: "update-bookmark",
              name: character.name,
              action: isBookmarked ? "delete" : "add",
            })
          }}
        />
        <MenuItem
          icon={isIgnored ? icons.ignore : icons.ignoreHollow}
          text={isIgnored ? "Unignore" : "Ignore"}
          onClick={() => {
            chatStream.send({
              type: "update-ignored",
              name: character.name,
              action: isIgnored ? "delete" : "add",
            })
          }}
        />
      </div>
      <div css={tw`p-2 bg-background-0`}>
        <CharacterMemoInput name={character.name} css={tw`block w-full`} />
      </div>
    </Popover>
  )
}

export default CharacterMenu
