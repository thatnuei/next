import { observer } from "mobx-react-lite"
import React from "react"
import { CharacterStatus } from "../character/types"
import useInput from "../dom/hooks/useInput"
import { input, solidButton } from "../ui/components"
import FormField from "../ui/components/FormField"
import LoadingIcon from "../ui/components/LoadingIcon"
import {
  fillArea,
  flexColumn,
  flexRow,
  spacedChildrenHorizontal,
  spacedChildrenVertical,
} from "../ui/helpers"
import { flex1 } from "../ui/helpers.new"
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
            <select css={input} {...status.bind}>
              {Object.entries(statuses).map(([status, text]) => (
                <option key={status} value={status}>
                  {text}
                </option>
              ))}
            </select>
          </FormField>

          <StatusMessageField labelText="Status message (optional)">
            <textarea css={[input, flex1]} {...statusMessage.bind} />
          </StatusMessageField>

          <Footer>
            <button css={solidButton} type="submit">
              {isLoading ? <LoadingIcon /> : "Set status"}
            </button>
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
  ${flex1};
  ${flexColumn};
`

const Footer = styled.div`
  ${flexRow};
  justify-content: flex-end;
  ${spacedChildrenHorizontal(spacing.small)};
`
