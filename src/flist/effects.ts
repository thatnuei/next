import { fetchJson } from "../http/helpers/fetchJson"
import { ApiResponse, LoginResponse } from "./types"

const getTicketUrl = "https://www.f-list.net/json/getApiTicket.php"

export const flist = {
  async login(account: string, password: string) {
    const response = await fetchJson<ApiResponse<LoginResponse>>(getTicketUrl, {
      method: "post",
      body: { account, password },
    })

    if (!("ticket" in response)) {
      throw new Error(response.error)
    }

    return response
  },
}
