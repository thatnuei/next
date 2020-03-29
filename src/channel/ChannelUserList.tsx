import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { CharacterModel } from "../character/CharacterModel"
import CharacterName from "../character/CharacterName"
import { TagProps } from "../jsx/types"
import VirtualizedList from "../ui/VirtualizedList"

type Props = TagProps<"div"> & {
  characters: CharacterModel[]
}

function ChannelUserList({ characters, ...props }: Props) {
  return (
    <div css={tw`flex flex-col`} {...props}>
      <div css={tw`px-3 py-2 bg-background-0`}>
        Characters: {characters.length}
      </div>
      <div css={tw`flex-1 min-h-0 bg-background-1`} role="list">
        <VirtualizedList
          items={characters}
          itemSize={32}
          renderItem={({ item, style }) => (
            <CharacterName
              role="listitem"
              character={item}
              style={style}
              css={tw`flex items-center px-2`}
            />
          )}
          getItemKey={(char) => char.name}
        />
      </div>
    </div>
  )
}

export default observer(ChannelUserList)
