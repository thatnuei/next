import ExternalLink from "../dom/ExternalLink"
import { getProfileUrl } from "../flist/helpers"
import { headerText2 } from "../ui/components"
import Avatar from "./Avatar"
import CharacterStatusText from "./CharacterStatusText"
import { useCharacter } from "./CharacterStore"
import { genderColors } from "./colors"
import { useNickname } from "./nicknames"

function CharacterSummary({ name }: { name: string }) {
  const { gender } = useCharacter(name)
  const nickname = useNickname(name)
  return (
    <div className="grid">
      <ExternalLink
        href={getProfileUrl(name)}
        style={{ color: genderColors[gender] }}
        className="mb-3"
      >
        <div className={headerText2}>{nickname || name}</div>
        {nickname ? <div className="text-sm">{name}</div> : null}
      </ExternalLink>

      <ExternalLink href={getProfileUrl(name)} className="mb-2">
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

export default CharacterSummary
