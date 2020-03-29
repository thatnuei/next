import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { scrollVertical } from "../ui/helpers"
import { CharacterModel } from "./CharacterModel"
import CharacterName from "./CharacterName"

type Props = TagProps<"div"> & {
  characters: CharacterModel[]
}

function CharacterList({ characters, ...props }: Props) {
  return (
    <div css={tw`flex flex-col`} {...props}>
      <div css={tw`px-3 py-2 bg-background-0`}>
        Characters: {characters.length}
      </div>
      <ul css={[tw`flex-1 px-3 py-2 bg-background-1`, scrollVertical]}>
        {characters.map((char, i) => (
          <li key={i} css={tw`mb-2`}>
            <CharacterName character={char} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default observer(CharacterList)
