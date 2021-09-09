import { raise } from "../common/raise"
import type { Dict } from "../common/types"
import type { GetApiTicketResponse } from "./api"
import { createFListApi } from "./api"

test("tryWithValidTicket", async () => {
  const validTickets = new Set<string>()

  // eslint-disable-next-line @typescript-eslint/require-await
  const fetch = async (endpoint: string, body: Dict<unknown>): Promise<any> => {
    if (endpoint === "/getApiTicket.php") {
      const response: GetApiTicketResponse = {
        ticket: "ticket",
        characters: ["a"],
      }

      validTickets.add(response.ticket)

      return response
    }

    if (!validTickets.has(body.ticket as string)) {
      raise("Invalid ticket")
    }

    if (endpoint === "/test-endpoint") {
      return { success: true }
    }

    raise("unexpected endpoint: " + endpoint)
  }

  const api = createFListApi(fetch)

  await api.login({ account: "test", password: "test" })

  const validTicketResult = await api.tryWithValidTicket((creds) => {
    return fetch("/test-endpoint", creds)
  })

  expect(validTicketResult).toEqual({ success: true })

  validTickets.delete("ticket")

  const expiredTicketResult = await api.tryWithValidTicket((creds) => {
    return fetch("/test-endpoint", creds)
  })

  expect(expiredTicketResult).toEqual({ success: true })
})
