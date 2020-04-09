import React, { useState } from "react"
import tw from "twin.macro"
import { useChatState } from "../chat/chatStateContext"
import { safeIndex } from "../common/safeIndex"
import { useWindowEvent } from "../dom/useWindowEvent"
import CharacterSummary from "./CharacterSummary"
import { CharacterModel } from "./state"

export function CharacterMenu() {
  const chatState = useChatState()
  const [container, setContainer] = useState<HTMLElement | null>()
  const [isOpen, setIsOpen] = useState(false)
  const [character, setCharacter] = useState<CharacterModel>()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  function openMenu(event: MouseEvent | TouchEvent) {
    const characterName = (() => {
      for (const target of event.composedPath()) {
        if (target instanceof HTMLElement && target.dataset.character) {
          return target.dataset.character
        }
      }
    })()

    if (characterName) {
      const touch =
        "clientX" in event ? event : safeIndex(event.changedTouches, 0)

      const x = touch?.clientX ?? 0
      const y = touch?.clientY ?? 0

      setCharacter(chatState.characters.get(characterName))
      setPosition({ x, y })
      setIsOpen(true)

      event.preventDefault()
    } else {
      setIsOpen(false)
    }
  }

  useWindowEvent("contextmenu", openMenu)
  useWindowEvent("touchend", openMenu)

  useWindowEvent("click", (event) => {
    if (!container?.contains(event.target as Node)) {
      setIsOpen(false)
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
    tw`fixed w-56 duration-300 bg-background-0 shadow-normal`,
    { transitionProperty: "transform, opacity, visibility" },
    isOpen
      ? tw`visible transform translate-y-0 opacity-100`
      : tw`invisible transform -translate-y-2 opacity-0`,
    { left, top },
  ]

  return (
    <div css={containerStyle} ref={setContainer}>
      {character && <CharacterSummary character={character} css={tw`p-3`} />}
    </div>
  )
}
