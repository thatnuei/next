import React, { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import tw from "twin.macro"
import { CharacterStatusType } from "../character/CharacterModel"
import { useIdentityCharacter } from "../character/state"
import Button from "../dom/Button"
import { delay } from "../helpers/common/delay"
import { useSocket } from "../socket/socketContext"
import { input, select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import { canSubmitStatusAtom, statusSubmitDelayAtom } from "./state"

function StatusUpdateForm() {
  const socket = useSocket()
  const identityCharacter = useIdentityCharacter()

  const [status, setStatus] = useState(identityCharacter.status.get())

  const [canSubmit, setCanSubmit] = useRecoilState(canSubmitStatusAtom)
  const submitDelay = useRecoilValue(statusSubmitDelayAtom)

  const submit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault()

    if (!canSubmit) return

    socket.send({
      type: "STA",
      params: { status: status.type, statusmsg: status.text },
    })

    setCanSubmit(false)
    await delay(submitDelay)
    setCanSubmit(true)
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
      <Button type="submit" css={solidButton} disabled={!canSubmit}>
        Submit
      </Button>
    </form>
  )
}

export default StatusUpdateForm
