import { raise } from "../common/raise"
import type { Dict } from "../common/types"
import type { GetApiTicketResponse } from "./api"
import { createFListApi } from "./api"

export function createTestApi() {
  const validTickets = new Set<string>()

  // eslint-disable-next-line @typescript-eslint/require-await
  async function testFListFetch(
    endpoint: string,
    body: Dict<unknown>,
  ): Promise<any> {
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

  const api = createFListApi(testFListFetch)

  function invalidateTickets() {
    validTickets.clear()
  }

  return { api, testFListFetch, invalidateTickets }
}
