import BBC from "../bbc/BBC"
import { statusColors } from "./colors"
import { useCharacter } from "./useCharacter"

function CharacterStatusText({ name }: { name: string }) {
  const { status, statusMessage } = useCharacter(name)
  return (
    <p className="text-sm">
      <span
        className={status === "crown" ? "rainbow-animation" : ""}
        style={{ color: statusColors[status] }}
      >
        {status === "crown" ? "awesome" : status}
      </span>
      {statusMessage ? <BBC text={` - ${statusMessage}`} /> : undefined}
    </p>
  )
}

export default CharacterStatusText
