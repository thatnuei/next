import { useSetRecoilState } from "recoil"
import { useChatCredentials } from "../chat/credentialsContext"
import { useSocketListener } from "../socket/socketContext"
import { statusOverlayVisibleAtom, statusSubmitDelayAtom } from "./state"

export function useStatusUpdateListeners() {
  const { identity } = useChatCredentials()

  const setStatusUpdateDelay = useSetRecoilState(statusSubmitDelayAtom)
  const setStatusOverlayVisible = useSetRecoilState(statusOverlayVisibleAtom)

  useSocketListener({
    VAR({ variable, value }) {
      if (variable === "sta_flood") {
        setStatusUpdateDelay((Number(value) || 5) * 1000) // value is in seconds
      }
    },

    STA({ character }) {
      if (character === identity) {
        setStatusOverlayVisible(false)
      }
    },
  })
}
