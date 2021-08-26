import { observer } from "mobx-react-lite"
import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { headerText2 } from "../ui/components"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import { genderColors } from "./colors"
import { useCharacter } from "./state"

function CharacterSummary({ name }: { name: string }) {
  const char = useCharacter(name)
  return (
    <div className="grid gap-3">
      <ExternalLink
        href={getProfileUrl(name)}
        className={headerText2}
        style={{ color: genderColors[char.gender] }}
      >
        {name}
      </ExternalLink>

      <ExternalLink href={getProfileUrl(name)}>
        <Avatar name={name} />
      </ExternalLink>

      <div
        className={`px-3 py-2 overflow-y-auto bg-midnight-1`}
        style={{ maxHeight: 300 }}
      >
        <CharacterStatusText name={name} />
      </div>
    </div>
  )
}

export default observer(CharacterSummary)
