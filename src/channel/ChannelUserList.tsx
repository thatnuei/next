import { useRect } from "@reach/rect"
import { Box } from "grommet"
import { observer } from "mobx-react-lite"
import React, { useRef } from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"
import CharacterName from "../character/CharacterName"
import { ThemeColor } from "../ui/theme"
import ChannelModel from "./ChannelModel"

function ChannelUserList({ channel }: { channel: ChannelModel }) {
  const { users } = channel

  const listRef = useRef(null)
  const rect: ClientRect | null = useRect(listRef)

  const renderUser = ({ index, style }: ListChildComponentProps) => {
    const character = users.characters[index]
    return (
      <Box pad="xsmall" justify="center" style={style}>
        <CharacterName key={character.name} {...character} />
      </Box>
    )
  }

  return (
    <Box width="small" height="100%">
      <Box background={ThemeColor.bg} pad="xsmall">
        Characters: {users.size}
      </Box>

      <Box gap="xxsmall" flex background={ThemeColor.bgDark} ref={listRef}>
        <FixedSizeList
          width={rect ? rect.width : 0}
          height={rect ? rect.height : 0}
          itemCount={users.size}
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
