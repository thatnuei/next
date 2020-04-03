import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { CharacterStatus } from "../character/types"
import { useChatContext } from "../chat/context"
import Button from "../dom/Button"
import { input, select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import { useStatusUpdateActions } from "./actions"

function StatusUpdateForm() {
  const { state } = useChatContext()
  const form = state.statusUpdate

  const { submitStatusUpdate } = useStatusUpdateActions()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitStatusUpdate()
  }

  return (
    <form
      css={tw`flex flex-col items-start h-full p-3`}
      onSubmit={handleSubmit}
    >
      <FormField labelText="Status" css={tw`block mb-3`}>
        <select
          css={select}
          value={form.status}
          onChange={(e) => {
            form.status = e.target.value as CharacterStatus
          }}
        >
          <option value="online">Online</option>
          <option value="looking">Looking</option>
          <option value="busy">Busy</option>
          <option value="away">Away</option>
          <option value="dnd">Do Not Disturb</option>
        </select>
      </FormField>
      <FormField
        labelText="Status message (optional)"
        css={tw`flex flex-col flex-1 mb-3`}
      >
        <textarea
          css={[input, tw`flex-1`]}
          value={form.statusMessage}
          onChange={(e) => {
            form.statusMessage = e.target.value
          }}
          onKeyPress={(event) => {
            if (event.key === "\n" && event.ctrlKey) {
              submitStatusUpdate()
            }
          }}
        />
      </FormField>
      <Button type="submit" css={solidButton} disabled={!form.canSubmit}>
        Submit
      </Button>
    </form>
  )
}

export default observer(StatusUpdateForm)
