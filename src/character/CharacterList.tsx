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
    <div css={[flexColumn, size("full")]}>
      <div css={[themeBgColor(0), px(3), py(2)]}>Characters: 420</div>
      <ul css={[themeBgColor(1), px(3), py(2), flex1, scrollVertical]}>
        {characters.map((char, i) => (
          <li key={i} css={[mb(2)]}>
            <CharacterName {...char} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CharacterList
