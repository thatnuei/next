import React from "react"
import { Overlay } from "../overlay/OverlayStore"
import ContextMenu from "../ui/components/ContextMenu"
import { Position } from "../ui/types"
import CharacterMenu from "./components/CharacterMenu"

export function createCharacterMenu(
  characterName: string,
  position: Position,
): Overlay {
  return {
    key: "characterMenu",
    render: (props) => (
      <ContextMenu
        position={position}
        children={<CharacterMenu characterName={characterName} />}
        {...props}
      />
    ),
  }
}
