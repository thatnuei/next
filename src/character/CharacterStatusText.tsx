import BBC from "../bbc/BBC"
import { useStoreSelect } from "../state/store"
import type { CharacterStore } from "./CharacterStore"
import { statusColors } from "./colors"

function CharacterStatusText({
  store,
  name,
}: {
  store: CharacterStore
  name: string
}) {
  const status =
    useStoreSelect(store, (state) => state[name]?.status) ?? "offline"

  const statusMessage = useStoreSelect(
    store,
    (state) => state[name]?.statusMessage,
  )

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
