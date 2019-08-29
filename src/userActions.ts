import { Dispatch } from "redux"
import extractErrorMessage from "./common/extractErrorMessage"
import {
  ApiResponse,
  getTicketUrl,
  LoginResponse,
} from "./flist/FListApiService"
import { fetchJson } from "./network/fetchJson"
import { createAction, createSimpleAction } from "./redux/helpers"

export const setIdentity = createAction("setIdentity", (identity: string) => ({
  identity,
}))

export const loginSubmit = createSimpleAction("loginSubmit")

export const loginSuccess = createAction(
  "loginSuccess",
  (account: string, ticket: string, characters: string[]) => ({
    account,
    ticket,
    characters,
  }),
)

export const loginError = createAction("loginError", (error: string) => ({
  error,
}))

export function submitLogin(account: string, password: string) {
  return async (dispatch: Dispatch) => {
    dispatch(loginSubmit())

    try {
      const res = await fetchJson<ApiResponse<LoginResponse>>(getTicketUrl, {
        method: "post",
        body: { account, password },
      })

      if (!("ticket" in res)) {
        throw new Error(res.error)
      }

      const { ticket, characters } = res
      dispatch(loginSuccess(account, ticket, characters))
    } catch (error) {
      dispatch(loginError(extractErrorMessage(error)))
    }
  }
}
