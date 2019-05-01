import React from "react"
import { CharacterStatus } from "../character/types"
import { preventDefault } from "../common/eventHelpers"
import { useOverlay } from "../overlay/OverlayContext"
import OverlayPanel from "../overlay/OverlayPanel"
import OverlayShade from "../overlay/OverlayShade"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Box from "../ui/Box"
import Button from "../ui/Button"
import FadedButton from "../ui/FadedButton"
import FormField from "../ui/FormField"
import Select from "../ui/Select"
import TextArea from "../ui/TextArea"
import { gapSizes } from "../ui/theme"

type Props = {}

export default function StatusOverlay(props: Props) {
  const { chatStore } = useRootStore()
  const { identityCharacter, updateStatus } = chatStore

  const status = useInput(identityCharacter.status)
  const statusMessage = useInput(identityCharacter.statusMessage)

  const overlay = useOverlay()

  const handleSubmit = () => {
    updateStatus(status.value as CharacterStatus, statusMessage.value)
    overlay.close()
  }

  return (
    <OverlayShade>
      <OverlayPanel>
        <OverlayPanel.Header>Update Status</OverlayPanel.Header>
        <Box
          as="form"
          pad={gapSizes.small}
          gap={gapSizes.small}
          onSubmit={preventDefault(handleSubmit)}
        >
          <FormField labelText="Status">
            <Select {...status.bind}>
              <option value="online">Online</option>
              <option value="looking">Looking</option>
              <option value="busy">Busy</option>
              <option value="away">Away</option>
              <option value="dnd">Do Not Disturb</option>
            </Select>
          </FormField>
          <FormField labelText="Status message (optional)">
            <TextArea
              placeholder="How's it going?"
              rows={4}
              cols={36}
              style={{ resize: "vertical" }}
              {...statusMessage.bind}
            />
          </FormField>
          <Box direction="row" gap={gapSizes.small} justify="flex-end">
            <FadedButton onClick={overlay.close}>Cancel</FadedButton>
            <Button type="submit">Update status</Button>
          </Box>
        </Box>
      </OverlayPanel>
    </OverlayShade>
  )
}
