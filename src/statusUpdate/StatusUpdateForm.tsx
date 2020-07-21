import { useObservable } from "micro-observables"
import React, { useState } from "react"
import tw from "twin.macro"
import { CharacterStatusType } from "../character/CharacterModel"
import { useIdentityCharacter } from "../character/helpers"
import Button from "../dom/Button"
import { useRootStore } from "../root/context"
import { input, select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"

function StatusUpdateForm() {
  const root = useRootStore()
  const identityCharacter = useIdentityCharacter()
  const [status, setStatus] = useState(identityCharacter.status.get())
  const isSubmitting = useObservable(root.statusUpdateStore.isSubmitting)

  const submit = (e?: React.SyntheticEvent) => {
    e?.preventDefault()
    root.statusUpdateStore.submit(status)
  }

  return (
    <form css={tw`flex flex-col items-start h-full p-3`} onSubmit={submit}>
      <FormField labelText="Status" css={tw`block mb-3`}>
        <select
          css={select}
          value={status.type}
          onChange={(e) =>
            setStatus((prev) => ({
              ...prev,
              type: e.target.value as CharacterStatusType,
            }))
          }
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
          value={status.text}
          onChange={(e) =>
            setStatus((prev) => ({
              ...prev,
              text: e.target.value,
            }))
          }
          onKeyPress={(event) => {
            if (event.key === "\n" && (event.ctrlKey || event.shiftKey)) {
              submit()
            }
          }}
        />
      </FormField>
      <Button type="submit" css={solidButton} disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  )
}

export default StatusUpdateForm
