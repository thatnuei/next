import compareBy from "../common/helpers/compareBy"
import toLower from "../common/helpers/toLower"
import { fetchJson } from "../http/helpers/fetchJson"

const getTicketUrl = "https://www.f-list.net/json/getApiTicket.php"

type ApiResponse<D> = { error: string } | ({ error: "" } & D)

export type LoginResponse = {
  ticket: string
  characters: string[]
  bookmarks: { name: string }[]

  // should consider client-sided-ly converting this to a more intuitive structure later
  // e.g. { us: string, them: string }
  friends: {
    /** Our character */
    dest_name: string
    /** Their character */
    source_name: string
  }[]
}

export default class FListApi {
  async login(account: string, password: string) {
    const response = await fetchJson<ApiResponse<LoginResponse>>(getTicketUrl, {
      method: "post",
      body: { account, password },
    })

    if (!("ticket" in response)) {
      throw new Error(response.error)
    }

    return {
      ...response,
      characters: response.characters.sort(compareBy(toLower)),
    }
  }
}
