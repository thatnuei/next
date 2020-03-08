import React from "react"
import {
  flex1,
  flexColumn,
  mb,
  px,
  py,
  scrollVertical,
  size,
  themeBgColor,
} from "../ui/style"
import CharacterName from "./CharacterName"
import { Character } from "./types"

type Props = { characters: Character[] }

function CharacterList({ characters }: Props) {
  return (
    <div>
      <div>Characters: 420</div>
      <ul>
        {characters.map((char, i) => (
          <li key={i}>
            <CharacterName {...char} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterList
