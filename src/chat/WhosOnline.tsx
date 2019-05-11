import { observer } from "mobx-react-lite"
import React from "react"
import CharacterName from "../character/CharacterName"
import OverlayPanel, { OverlayPanelHeader } from "../overlay/OverlayPanel"
import OverlayShade from "../overlay/OverlayShade"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import { gapSizes } from "../ui/theme"

function WhosOnline() {
  const { chatStore } = useRootStore()
  const friends = chatStore.friends.characters.filter(
    (char) => char.status !== "offline",
  )

  return (
    <OverlayShade>
      <OverlayPanel maxWidth={500}>
        <OverlayPanelHeader>Who&apos;s Online</OverlayPanelHeader>

        <Box width={500} pad={gapSizes.small} gap={gapSizes.small}>
          <h3>Friends</h3>
          <ol>
            {friends.map((char) => (
              <li key={char.name}>
                <CharacterName name={char.name} />
              </li>
            ))}
          </ol>
          <h3>Bookmarks</h3>
        </Box>
      </OverlayPanel>
    </OverlayShade>
  )
}

export default observer(WhosOnline)
