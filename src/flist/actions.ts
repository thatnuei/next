import { AsyncAction } from "overmind"
import extractErrorMessage from "../common/helpers/extractErrorMessage"

export const submitLogin: AsyncAction<{
  account: string
  password: string
}> = async ({ state, effects }, { account, password }) => {
  if (state.login.loading) return

  state.login.loading = true
  state.login.error = undefined

  try {
    const { ticket, characters } = await effects.flist.login(account, password)
    const identity = await effects.identityStorage.get(account)

    state.user.account = account
    state.user.ticket = ticket
    state.user.characters = [...characters].sort()
    state.chat.identity = identity || characters[0]
    state.view = "characterSelect"
  } catch (error) {
    state.login.error = extractErrorMessage(error)
  }

  state.login.loading = false
}
