import { AsyncAction } from "overmind"
import extractErrorMessage from "../common/helpers/extractErrorMessage"

export const submitLogin: AsyncAction<{
  account: string
  password: string
}> = async ({ state, actions, effects }, { account, password }) => {
  if (state.user.login.loading) return

  state.user.login = { loading: true }

  try {
    const { ticket, characters } = await effects.flist.flist.login(
      account,
      password,
    )
    const identity = await effects.chat.identityStorage.get(account)

    state.user.account = account
    state.user.ticket = ticket
    state.user.characters = [...characters].sort()
    state.chat.identity = identity || characters[0]
    actions.app.showCharacterSelect()

    state.user.login = { loading: false }
  } catch (error) {
    state.user.login = { loading: false, error: extractErrorMessage(error) }
  }
}
