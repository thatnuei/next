import { observer } from "mobx-react-lite"
import React from "react"
import CharacterModel from "../character/CharacterModel"
import CharacterName from "../character/CharacterName"
import OverlayPanel, { OverlayPanelHeader } from "../overlay/OverlayPanel"
import OverlayShade from "../overlay/OverlayShade"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import { spacing } from "../ui/theme"

function OnlineUsers() {
  const { chatStore } = useRootStore()

  const isOnline = (char: CharacterModel) => char.status !== "offline"

  const friends = chatStore.friends.characters.filter(isOnline)
  const bookmarks = chatStore.bookmarks.characters.filter(isOnline)

  return (
    <OverlayShade>
      <OverlayPanel maxWidth={300}>
        <OverlayPanelHeader>Online Users</OverlayPanelHeader>

        <Box pad={spacing.small} gap={spacing.small}>
          <h3>Friends</h3>
          <ol>
            {friends.map((char) => (
              <li key={char.name}>
                <CharacterName name={char.name} />
              </li>
            ))}
          </ol>

          <h3>Bookmarks</h3>
          <ol>
            {bookmarks.map((char) => (
              <li key={char.name}>
                <CharacterName name={char.name} />
              </li>
            ))}
          </ol>
        </Box>
      </OverlayPanel>
    </OverlayShade>
  )
}

export default observer(OnlineUsers)
