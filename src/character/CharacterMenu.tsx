import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { FocusOn } from "react-focus-on"
import tw from "twin.macro"
import { useChatState } from "../chat/chatStateContext"
import { useChatStream } from "../chat/streamContext"
import { useWindowEvent } from "../dom/useWindowEvent"
import { getProfileUrl } from "../flist/helpers"
import * as icons from "../ui/icons"
import CharacterMemoInput from "./CharacterMemoInput"
import CharacterMenuItem from "./CharacterMenuItem"
import CharacterSummary from "./CharacterSummary"
import { CharacterModel } from "./state"

function CharacterMenu() {
  const chatState = useChatState()
  const chatStream = useChatStream()
  const [container, setContainer] = useState<HTMLElement | null>()
  const [isOpen, setIsOpen] = useState(false)
  const [character, setCharacter] = useState<CharacterModel>()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useWindowEvent("click", function openMenu(event: MouseEvent) {
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

      setCharacter(chatState.characters.get(characterName))
      setPosition({ x, y })
      setIsOpen(true)

      event.preventDefault()
    }
  })

  const containerWidth = container?.clientWidth ?? 0
  const containerHeight = container?.clientHeight ?? 0

  const edgeSpacing = 12

  const left = Math.min(
    position.x,
    window.innerWidth - containerWidth - edgeSpacing,
  )

  const top = Math.min(
    position.y,
    window.innerHeight - containerHeight - edgeSpacing,
  )

  const containerStyle = [
    tw`fixed w-56 duration-300 shadow-normal bg-background-1`,
    { transitionProperty: "transform, opacity, visibility" },
    isOpen
      ? tw`visible transform translate-y-0 opacity-100`
      : tw`invisible transform -translate-y-2 opacity-0`,
    { left, top },
  ]

  if (!character) return null

  const isIgnored = chatState.ignored.has(character.name)
  const isBookmarked = chatState.bookmarks.has(character.name)

  return (
    <FocusOn
      enabled={isOpen}
      onEscapeKey={() => setIsOpen(false)}
      onClickOutside={() => setIsOpen(false)}
    >
      <div css={containerStyle} ref={setContainer}>
        <CharacterSummary character={character} css={tw`p-3 bg-background-0`} />
        <div css={tw`flex flex-col`} onClick={() => setIsOpen(false)}>
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
            icon={icons.bookmark}
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
            icon={icons.ignore}
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
      </div>
    </FocusOn>
  )
}

export default observer(CharacterMenu)
