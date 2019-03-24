import React, { useContext, useRef, useState } from "react"
import { css, styled } from "../ui/styled"
import usePopup from "../ui/usePopup"
import CharacterMenu from "./CharacterMenu"

const CharacterMenuContext = React.createContext({
  open: (characterName: string, event: React.MouseEvent) => {},
  close: () => {},
})

export const CharacterMenuProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const popup = usePopup(menuRef)
  const [characterName, setCharacterName] = useState<string>()

  const context = {
    open: async (newCharacterName: string, event: React.MouseEvent) => {
      setCharacterName(newCharacterName)
      popup.openAt({ x: event.clientX, y: event.clientY })
    },
    close: () => {
      popup.close()
    },
  }

  return (
    <CharacterMenuContext.Provider value={context}>
      {children}

      <FadeSlideAnimation
        ref={menuRef}
        style={popup.style}
        visible={popup.isVisible}
      >
        {characterName ? <CharacterMenu characterName={characterName} /> : null}
      </FadeSlideAnimation>
    </CharacterMenuContext.Provider>
  )
}

export const useCharacterMenuContext = () => useContext(CharacterMenuContext)

const FadeSlideAnimation = styled.div<{ visible?: boolean }>`
  transition: 0.2s;
  transition-property: transform, opacity, visibility;

  ${(props) =>
    props.visible
      ? css`
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        `
      : css`
          transform: translateY(-1rem);
          opacity: 0;
          visibility: hidden;
        `}
`
