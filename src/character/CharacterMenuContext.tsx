import React, { useContext, useRef, useState } from "react"
import useContextMenu from "../ui/useContextMenu"
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
  const menuActions = useContextMenu(menuRef)
  const [characterName, setCharacterName] = useState<string>()

  const context = {
    open: (newCharacterName: string, event: React.MouseEvent) => {
      setCharacterName(newCharacterName)
      menuActions.handleTargetClick(event)
    },
    close: menuActions.close,
  }

  return (
    <CharacterMenuContext.Provider value={context}>
      {children}
      <div ref={menuRef}>
        {characterName ? <CharacterMenu characterName={characterName} /> : null}
      </div>
    </CharacterMenuContext.Provider>
  )
}

export const useCharacterMenuContext = () => useContext(CharacterMenuContext)
