import { useEffect, useState } from "react"
import Avatar from "../character/Avatar"
import { compareLower } from "../common/compareLower"
import type { NonEmptyArray } from "../common/types"
import Button from "../dom/Button"
import { preventDefault } from "../react/preventDefault"
import { routes } from "../router"
import { anchor, select, solidButton } from "../ui/components"
import { useUserActions } from "../user"

function CharacterSelect({
  account,
  characters,
}: {
  account: string
  characters: NonEmptyArray<string>
}) {
  const userActions = useUserActions()

  const lastIdentityKey = `lastIdentity:${account}`

  const [identity, setIdentity] = useState<string>(
    () => localStorage.getItem(lastIdentityKey) || characters[0],
  )

  useEffect(() => {
    localStorage.setItem(lastIdentityKey, identity)
  })

  function enterChat() {
    userActions.setIdentity(identity)
    routes.chat().push()
  }

  function returnToLogin() {
    routes.login().push()
  }

  return (
    <form
      className="flex flex-col items-center p-4 space-y-4"
      onSubmit={preventDefault(enterChat)}
    >
      <Avatar name={identity} />
      <select
        className={select}
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
      >
        {[...characters].sort(compareLower).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <Button className={solidButton} type="submit">
        Enter chat
      </Button>
      <Button className={anchor} onClick={returnToLogin}>
        Return to Login
      </Button>
    </form>
  )
}

export default CharacterSelect
