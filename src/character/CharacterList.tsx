import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { scrollVertical } from "../ui/style"
import CharacterName from "./CharacterName"
import { Character } from "./types"

type Props = TagProps<"div"> & {
  characters: Character[]
}

function CharacterList({ characters, ...props }: Props) {
  return (
    <div css={tw`flex flex-col`} {...props}>
      <div css={tw`bg-background-0 px-3 py-2`}>Characters: 420</div>
      <ul css={[tw`bg-background-1 px-3 py-2 flex-1`, scrollVertical]}>
        {characters.map((char, i) => (
          <li key={i} css={tw`mb-2`}>
            <CharacterName {...char} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CharacterList
