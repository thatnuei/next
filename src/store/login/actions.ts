import extractErrorMessage from "../../common/helpers/extractErrorMessage"
import { login } from "../../flist/helpers/login"
import { createAction } from "../../redux/helpers/createAction"
import { ThunkAction } from "../types"

export const loginStart = createAction("loginStart")

export const loginSuccess = createAction<{
  account: string
  ticket: string
  characters: string[]
}>("loginSuccess")

export const loginError = createAction<{ error: string }>("loginError")

export function submitLogin(account: string, password: string): ThunkAction {
  return async (dispatch) => {
    dispatch(loginStart())

    try {
      const { ticket, characters } = await login(account, password)
      dispatch(loginSuccess({ account, ticket, characters }))
    } catch (error) {
      dispatch(loginError({ error: extractErrorMessage(error) }))
    }
  }
}
