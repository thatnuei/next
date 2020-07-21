import { useObservable } from "micro-observables"
import React, { useState } from "react"
import tw from "twin.macro"
import { useWindowEvent } from "../dom/useWindowEvent"
import { getProfileUrl } from "../flist/helpers"
import { useOpenAndShowPrivateChatAction } from "../privateChat/state"
import { useRootStore } from "../root/context"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import MenuItem from "../ui/MenuItem"
import Popover, { usePopover } from "../ui/Popover"
import CharacterMemoInput from "./CharacterMemoInput"
import CharacterSummary from "./CharacterSummary"

function CharacterMenu() {
  const [characterName, setCharacterName] = useState<string | undefined>()
  const root = useRootStore()
  const popover = usePopover()
  const bookmarks = useObservable(root.characterStore.bookmarks)
  const ignored = useObservable(root.characterStore.ignored)
  const friends = useObservable(root.characterStore.friends)

  const openChat = useOpenAndShowPrivateChatAction()

  function handleClick(event: MouseEvent) {
    const characterName = (() => {
      for (const target of event.composedPath()) {
        if (target instanceof HTMLElement && target.dataset.character) {
          return target.dataset.character
        }
      }
    })()

    if (characterName) {
      event.preventDefault()
      setCharacterName(characterName)
      popover.showAt({ x: event.clientX, y: event.clientY })
    }
  }

  useWindowEvent("click", handleClick)

  if (!characterName) return null

  const isIgnored = ignored.includes(characterName)
  const isBookmarked = bookmarks.includes(characterName)
  const friendshipItems = friends.filter((it) => it.them === characterName)

  return (
    <Popover {...popover.props} css={tw`w-56`}>
      <div css={tw`p-3 bg-background-0`}>
        <CharacterSummary name={characterName} />

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

      <div css={tw`flex flex-col`} onClick={popover.show}>
        <MenuItem
          icon={icons.link}
          text="Profile"
          href={getProfileUrl(characterName)}
        />
        <MenuItem
          icon={icons.message}
          text="Message"
          onClick={() => openChat(characterName)}
        />
        <MenuItem
          icon={isBookmarked ? icons.bookmark : icons.bookmarkHollow}
          text={isBookmarked ? "Remove bookmark" : "Bookmark"}
          onClick={() => {
            if (isBookmarked) {
              root.userStore
                .removeBookmark({ name: characterName })
                .catch(console.error) // show error toast
            } else {
              root.userStore
                .addBookmark({ name: characterName })
                .catch(console.error) // show error toast
            }
          }}
        />
        <MenuItem
          icon={isIgnored ? icons.ignore : icons.ignoreHollow}
          text={isIgnored ? "Unignore" : "Ignore"}
          onClick={() => {
            root.socket.send({
              type: "IGN",
              params: {
                action: isIgnored ? "delete" : "add",
                character: characterName,
              },
            })
          }}
        />
      </div>
      <div css={tw`p-2 bg-background-0`}>
        <CharacterMemoInput name={characterName} css={tw`block w-full`} />
      </div>
    </Popover>
  )
}

export default CharacterMenu
