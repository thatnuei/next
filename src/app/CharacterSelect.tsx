import { useEffect, useState } from "react"
import Avatar from "../character/Avatar"
import { compareLower } from "../common/compareLower"
import Button from "../dom/Button"
import type { AuthUser } from "../flist/types"
import { preventDefault } from "../react/preventDefault"
import { anchor, select, solidButton } from "../ui/components"

function CharacterSelect({
  user,
  onSubmit,
  onBack,
}: {
  user: AuthUser
  onSubmit: (character: string) => void
  onBack: () => void
}) {
  const lastIdentityKey = `lastIdentity:${user.account}`

  const [identity, setIdentity] = useState<string>(
    () => localStorage.getItem(lastIdentityKey) || user.characters[0],
  )

  useEffect(() => {
    localStorage.setItem(lastIdentityKey, identity)
  })

  return (
    <form
      className="flex flex-col items-center p-4 space-y-4"
      onSubmit={preventDefault(() => onSubmit(identity))}
    >
      <Avatar name={identity} />
      <select
        className={select}
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
      >
        {[...user.characters].sort(compareLower).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <Button className={solidButton} type="submit">
        Enter chat
      </Button>
      <Button className={anchor} onClick={onBack}>
        Return to Login
      </Button>
    </form>
  )
}

export default CharacterSelect
