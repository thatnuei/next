import React, { useContext, useRef } from "react"
import CharacterMenu from "./CharacterMenu"
import useContextMenu from "./useContextMenu"

const CharacterMenuContext = React.createContext({
  open: (target: Element) => {},
  close: () => {},
  handleTargetClick: (event: React.MouseEvent) => {},
})

export const CharacterMenuProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const menuActions = useContextMenu(menuRef)
  return (
    <CharacterMenuContext.Provider value={menuActions}>
      {children}
      <CharacterMenu ref={menuRef} />
    </CharacterMenuContext.Provider>
  )
}

export const useCharacterMenuContext = () => useContext(CharacterMenuContext)
