import { atom } from "recoil"

export const canSubmitStatusAtom = atom({
  key: "canSubmitStatus",
  default: true,
})

export const statusSubmitDelayAtom = atom({
  key: "statusSubmitDelay",
  default: 5000,
})

export const statusOverlayVisibleAtom = atom({
  key: "statusOverlayVisible",
  default: false,
})
