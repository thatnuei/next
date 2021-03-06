import * as React from "react"
import { useState } from "react"
import BBC from "../bbc/BBC"
import BBCTextArea from "../bbc/BBCInput"
import type { CharacterStatus } from "../character/types"
import { useCharacter } from "../character/useCharacter"
import Button from "../dom/Button"
import { decodeHtml } from "../dom/decodeHtml"
import { createCommandHandler } from "../socket/helpers"
import { useEmitterListener } from "../state/emitter"
import { createInputState, getInputStateValue } from "../state/input"
import { createStore, useStoreValue } from "../state/store"
import { select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import Icon from "../ui/Icon"
import { about } from "../ui/icons"
import { useChatContext } from "./ChatContext"

const isSubmittingStore = createStore(false)

function StatusUpdateForm({ onSuccess }: { onSuccess: () => void }) {
  const { identity, socket } = useChatContext()
  const character = useCharacter(identity)
  const [status, setStatus] = useState(character.status)
  const [statusMessageInput, setStatusMessageInput] = useState(() =>
    createInputState(decodeHtml(character.statusMessage)),
  )
  const isSubmitting = useStoreValue(isSubmittingStore)

  useEmitterListener(
    socket.commands,
    createCommandHandler({
      STA(params) {
        if (params.character === identity) {
          onSuccess()
        }
      },
    }),
  )

  const submit = (e?: React.SyntheticEvent) => {
    e?.preventDefault()

    if (isSubmitting) return

    // submission has a timeout
    isSubmittingStore.set(true)
    setTimeout(() => {
      isSubmittingStore.set(false)
    }, 7000)

    socket.send({
      type: "STA",
      params: { status, statusmsg: getInputStateValue(statusMessageInput) },
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
          inputState={statusMessageInput}
          onInputStateChange={setStatusMessageInput}
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
