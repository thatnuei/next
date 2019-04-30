import React from "react"
import { CharacterStatus } from "../character/types"
import { preventDefault } from "../common/eventHelpers"
import { useRootStore } from "../RootStore"
import useInput from "../state/useInput"
import Box from "../ui/Box"
import Button from "../ui/Button"
import FadedButton from "../ui/FadedButton"
import FormField from "../ui/FormField"
import Select from "../ui/Select"
import TextArea from "../ui/TextArea"
import { gapSizes } from "../ui/theme"

type Props = {
  onSubmit: () => void
  onCancel: () => void
}

export default function StatusForm(props: Props) {
  const { chatStore } = useRootStore()
  const { identityCharacter, updateStatus } = chatStore
  const status = useInput(identityCharacter.status)
  const statusMessage = useInput(identityCharacter.statusMessage)

  const handleSubmit = () => {
    updateStatus(status.value as CharacterStatus, statusMessage.value)
    props.onSubmit()
  }

  return (
    <Box
      as="form"
      pad={gapSizes.small}
      gap={gapSizes.small}
      width={300}
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
          rows={3}
          style={{ resize: "vertical" }}
          {...statusMessage.bind}
        />
      </FormField>
      <Box direction="row" gap={gapSizes.small} justify="flex-end">
        <FadedButton onClick={props.onCancel}>Cancel</FadedButton>
        <Button type="submit">Update status</Button>
      </Box>
    </Box>
  )
}
