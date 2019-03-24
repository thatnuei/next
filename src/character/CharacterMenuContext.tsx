import React, { useContext, useLayoutEffect, useRef, useState } from "react"
import { css, styled } from "../ui/styled"
import useWindowEvent from "../ui/useWindowEvent"
import CharacterMenu from "./CharacterMenu"

const CharacterMenuContext = React.createContext({
  open: (characterName: string, event: React.MouseEvent) => {},
  close: () => {},
})

function getClientRect(element: Element) {
  return new Promise<ClientRect | DOMRect>((resolve, reject) => {
    const observer = new IntersectionObserver(([entry]) => {
      resolve(entry.boundingClientRect)
      observer.disconnect()
    })
    observer.observe(element)
  })
}

function usePopup(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [style, setStyle] = useState<React.CSSProperties>({})

  useWindowEvent("click", (event) => {
    if (event.target === ref.current) return
    setIsVisible(false)
  })

  useLayoutEffect(() => {
    const menu = ref.current
    if (!menu) return

    setStyle({
      position: "fixed",
      left: Math.min(position.x, window.innerWidth - menu.clientWidth),
      top: Math.min(position.y, window.innerHeight - menu.clientHeight),
    })
  }, [position.x, position.y, ref])

  const openAt = (position: { x: number; y: number }) => {
    setPosition(position)
    setIsVisible(true)
  }

  const close = () => {
    setIsVisible(false)
  }

  return { openAt, close, isVisible, style }
}

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
