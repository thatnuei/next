import { atom, useAtom } from "jotai"
import * as React from "react"
import { useState } from "react"
import BBC from "../bbc/BBC"
import BBCTextArea from "../bbc/BBCInput"
import { useCharacter } from "../character/state"
import type { CharacterStatus } from "../character/types"
import { raise } from "../common/raise"
import Button from "../dom/Button"
import { decodeHtml } from "../dom/decodeHtml"
import { useSocketActions, useSocketListener } from "../socket/SocketConnection"
import { select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import Icon from "../ui/Icon"
import { about } from "../ui/icons"
import { useIdentity } from "../user"

const isSubmittingAtom = atom(false)

function StatusUpdateForm({ onSuccess }: { onSuccess: () => void }) {
  const identity = useIdentity() ?? raise("Identity not set")
  const character = useCharacter(identity)
  const [status, setStatus] = useState(character.status)
  const [statusMessage, setStatusMessage] = useState(() =>
    decodeHtml(character.statusMessage),
  )
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom)
  const { send } = useSocketActions()

  useSocketListener((command) => {
    if (command.type === "STA" && command.params.character === identity) {
      onSuccess()
    }
  })

  const submit = (e?: React.SyntheticEvent) => {
    e?.preventDefault()

    if (isSubmitting) return

    // submission has a timeout
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
    }, 7000)

    send({
      type: "STA",
      params: { status, statusmsg: statusMessage },
    })
  }

  return (
    <form className={`grid content-start h-full gap-3 p-3`} onSubmit={submit}>
      <FormField labelText="Status">
        <select
          className={select}
          value={status}
          onChange={(e) => setStatus(e.target.value as CharacterStatus)}
        >
          <option value="online">Online</option>
          <option value="looking">Looking</option>
          <option value="busy">Busy</option>
          <option value="away">Away</option>
          <option value="dnd">Do Not Disturb</option>
        </select>
      </FormField>
      <FormField labelText="Status message (optional)">
        <BBCTextArea
          value={statusMessage}
          onChangeText={setStatusMessage}
          maxLength={255}
          placeholder="Hey! How's it goin'?"
          onKeyPress={(event) => {
            if (event.key === "\n" && (event.ctrlKey || event.shiftKey)) {
              submit()
            }
          }}
          renderPreview={(text) => <BBC text={text} />}
        />
      </FormField>
      <Button
        type="submit"
        className={`${solidButton} justify-self-start`}
        disabled={isSubmitting}
      >
        Submit
      </Button>

      <div className="text-sm prose">
        <p>
          <Icon which={about} size={4} inline /> Your status will be restored
          the next time you log in, in case of disconnect, closing the window,
          etc.
        </p>
        <p>
          If you log out manually (click the logout button on the bottom left),
          your status will be cleared for the next time you log in.
        </p>
      </div>
    </form>
  )
}

export default StatusUpdateForm
