import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { useStoreSelect } from "../state/store"
import { headerText2 } from "../ui/components"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import type { CharacterStore } from "./CharacterStore"
import { genderColors } from "./colors"
import { useNickname } from "./nicknames"

function CharacterSummary({
  store,
  name,
}: {
  store: CharacterStore
  name: string
}) {
  const gender = useStoreSelect(store, (state) => state[name]?.gender) ?? "None"
  const nickname = useNickname(name)
  return (
    <div className="grid gap-3">
      <ExternalLink
        href={getProfileUrl(name)}
        style={{ color: genderColors[gender] }}
      >
        <div className={headerText2}>{nickname || name}</div>
        {nickname ? <div className="text-sm">{name}</div> : null}
      </ExternalLink>

      <ExternalLink href={getProfileUrl(name)}>
        <Avatar name={name} />
      </ExternalLink>

      <div
        className={`px-3 py-2 overflow-y-auto bg-midnight-1`}
        style={{ maxHeight: 300 }}
      >
        <CharacterStatusText name={name} store={store} />
      </div>
    </div>
  )
}

export default CharacterSummary
