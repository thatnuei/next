import { useRect } from "@reach/rect"
import { observer } from "mobx-react-lite"
import { rgba } from "polished"
import React, { CSSProperties, useRef } from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import CharacterName from "../character/CharacterName"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import { gapSizes } from "../ui/theme"
import ChannelModel from "./ChannelModel"

function ChannelUserList({ channel }: { channel: ChannelModel }) {
  const { chatStore } = useRootStore()
  const { sortedUsers } = channel

  const listRef = useRef<HTMLDivElement>(null)
  const rect: ClientRect | null = useRect(listRef)

  const getHighlight = (name: string) => {
    if (chatStore.isFriend(name)) return rgba(46, 204, 113, 0.15)
    if (chatStore.isAdmin(name)) return rgba(231, 76, 60, 0.15)
    if (channel.ops.has(name)) return rgba(241, 196, 15, 0.15)
  }

  const renderUser = ({ index, style }: ListChildComponentProps) => {
    const character = sortedUsers[index]

    const fullStyle: CSSProperties = {
      ...style,
      backgroundColor: getHighlight(character.name),
    }

    return (
      <Box pad="xsmall" justify="center" style={fullStyle}>
        <CharacterName name={character.name} />
      </Box>
    )
  }

  return (
    <Box width="small" height="100%">
      <Box background="theme0" pad="xsmall">
        Characters: {sortedUsers.length}
      </Box>

      <Box gap={gapSizes.xxsmall} flex background="theme1" ref={listRef}>
        <FixedSizeList
          width={rect ? rect.width : 0}
          height={rect ? rect.height : 0}
          itemCount={sortedUsers.length}
          itemSize={30}
          overscanCount={10}
        >
          {renderUser}
        </FixedSizeList>
      </Box>
    </Box>
  )
}
export default observer(ChannelUserList)
