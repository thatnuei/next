import { useObservable } from "micro-observables"
import React from "react"
import tw from "twin.macro"
import Avatar from "../character/Avatar"
import Button from "../dom/Button"
import { useRootStore } from "../root/context"
import {
  anchor,
  headerText,
  raisedPanel,
  raisedPanelHeader,
  select,
  solidButton,
} from "../ui/components"
import { centerItems, fixedCover, flexColumn } from "../ui/helpers"

function CharacterSelect() {
  const root = useRootStore()
  const { characters, account } = useObservable(root.userStore.userData)
  const identity = useObservable(root.appStore.identity)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    root.appStore.enterChat()
  }

  return (
    <div css={[fixedCover, flexColumn, centerItems]}>
      <div css={raisedPanel}>
        <header css={raisedPanelHeader}>
          <h1 css={headerText}>Select a Character</h1>
        </header>
        <form css={[flexColumn, tw`items-center p-4`]} onSubmit={handleSubmit}>
          <Avatar name={identity} />
          <select
            css={[select, tw`my-4`]}
            value={identity}
            onChange={(e) => root.appStore.setIdentity(e.target.value, account)}
          >
            {characters.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Button css={solidButton} type="submit">
            Enter chat
          </Button>
          <Button css={[anchor, tw`mt-4`]} onClick={root.appStore.showLogin}>
            Return to Login
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CharacterSelect
