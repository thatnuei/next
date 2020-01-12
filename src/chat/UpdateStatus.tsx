import { observer } from "mobx-react-lite"
import React from "react"
import { CharacterStatus } from "../character/types"
import useInput from "../dom/hooks/useInput"
import Button from "../ui/components/Button"
import FormField from "../ui/components/FormField"
import LoadingIcon from "../ui/components/LoadingIcon"
import Select from "../ui/components/Select"
import TextArea from "../ui/components/TextArea"
import {
  fillArea,
  flexColumn,
  flexGrow,
  flexRow,
  spacedChildrenHorizontal,
  spacedChildrenVertical,
} from "../ui/helpers"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
// @ts-ignore
import useRootStore from "../useRootStore"

type SelectableStatus = Exclude<CharacterStatus, "idle" | "crown" | "offline">

const statuses: Record<SelectableStatus, string> = {
  online: "Online",
  looking: "Looking",
  busy: "Busy",
  away: "Away",
  dnd: "Do Not Disturb",
}

function UpdateStatusForm() {
  const root = useRootStore()
  const { identityCharacter } = root.characterStore
  const isLoading = root.characterStore.updatingStatus

  const status = useInput(identityCharacter.status)
  const statusMessage = useInput(identityCharacter.statusMessage)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    root.characterStore.updateStatus(
      status.value as CharacterStatus,
      statusMessage.value,
    )
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FieldSet disabled={isLoading}>
        <InnerContainer>
          <FormField labelText="Status">
            <Select {...status.bind}>
              {Object.entries(statuses).map(([status, text]) => (
                <option key={status} value={status}>
                  {text}
                </option>
              ))}
            </Select>
          </FormField>

          <StatusMessageField labelText="Status message (optional)">
            <StatusMessageTextArea {...statusMessage.bind} />
          </StatusMessageField>

          <Footer>
            <Button type="submit">
              {isLoading ? <LoadingIcon /> : "Set status"}
            </Button>
          </Footer>
        </InnerContainer>
      </FieldSet>
    </Form>
  )
}

export default observer(UpdateStatusForm)

const Form = styled.form`
  ${fillArea};
`

const FieldSet = styled.fieldset`
  ${fillArea};

  transition: 0.2s opacity;
  :disabled {
    opacity: 0.5;
  }
`

const InnerContainer = styled.div`
  ${flexColumn};
  padding: ${spacing.small};
  ${spacedChildrenVertical(spacing.small)};
  ${fillArea};
`

const StatusMessageField = styled(FormField)`
  ${flexGrow};
  ${flexColumn};
`

const StatusMessageTextArea = styled(TextArea)`
  ${flexGrow};
`

const Footer = styled.div`
  ${flexRow};
  justify-content: flex-end;
  ${spacedChildrenHorizontal(spacing.small)};
`
