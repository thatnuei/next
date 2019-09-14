// import { AsyncAction } from "overmind"
// import createUniqueId from "../../common/helpers/createUniqueId"
// import sleep from "../../common/helpers/sleep"
// import { UiMessageLevel } from "./types"

// type UiMessageConfig = {
//   text: string
//   level: UiMessageLevel
// }

// export const showUiMessage: AsyncAction<UiMessageConfig> = async (
//   { state },
//   config,
// ) => {
//   const key = createUniqueId()
//   state.uiMessages.push({ ...config, key })

//   await sleep(Math.max(config.text.length * 100, 3000))

//   state.uiMessages = state.uiMessages.filter((msg) => msg.key !== key)
// }
export {}
