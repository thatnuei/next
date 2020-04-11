import { useLocalStore, useObserver } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { useChatState } from "../chat/chatStateContext"
import { useChatStream } from "../chat/streamContext"
import { useWindowEvent } from "../dom/useWindowEvent"
import { getProfileUrl } from "../flist/helpers"
import ContextMenu from "../ui/ContextMenu"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { OverlayModel } from "../ui/OverlayModel"
import CharacterMemoInput from "./CharacterMemoInput"
import CharacterMenuItem from "./CharacterMenuItem"
import CharacterSummary from "./CharacterSummary"
import { CharacterModel } from "./state"

function CharacterMenu() {
  const chatState = useChatState()
  const chatStream = useChatStream()

  const state = useLocalStore(() => ({
    menu: new OverlayModel(),
    character: undefined as CharacterModel | undefined,
    position: { x: 0, y: 0 },

    handleClick(event: MouseEvent) {
      const characterName = (() => {
        for (const target of event.composedPath()) {
          if (target instanceof HTMLElement && target.dataset.character) {
            return target.dataset.character
          }
        }
      })()

      if (characterName) {
        const x = event.clientX
        const y = event.clientY

        state.character = chatState.characters.get(characterName)
        state.position = { x, y }
        state.menu.show()

        event.preventDefault()
      }
    },
  }))

  useWindowEvent("click", state.handleClick)

  return useObserver(() => {
    const { character, position, menu } = state
    if (!character) return null

    const isIgnored = chatState.ignored.has(character.name)
    const isBookmarked = chatState.bookmarks.has(character.name)

    const friendshipItems = [...chatState.friends].filter(
      (it) => it.them === character.name,
    )

    return (
      <ContextMenu state={menu} {...position} css={tw`w-56`}>
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

        <div css={tw`flex flex-col`} onClick={menu.hide}>
          <CharacterMenuItem
            icon={icons.link}
            text="Profile"
            href={getProfileUrl(character.name)}
          />
          <CharacterMenuItem
            icon={icons.message}
            text="Message"
            onClick={() => {
              chatStream.send({
                type: "open-private-chat",
                name: character.name,
              })
            }}
          />
          <CharacterMenuItem
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
          <CharacterMenuItem
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
      </ContextMenu>
    )
  })
}

export default CharacterMenu
