import { createTestApi } from "./test-api"

test("tryWithValidTicket", async () => {
  const { api, testFListFetch, invalidateTickets } = createTestApi()

  await api.login({ account: "test", password: "test" })

  const validTicketResult = await api.tryWithValidTicket((creds) => {
    return testFListFetch("/test-endpoint", creds)
  })

  expect(validTicketResult).toEqual({ success: true })

  invalidateTickets()

  const expiredTicketResult = await api.tryWithValidTicket((creds) => {
    return testFListFetch("/test-endpoint", creds)
  })

  expect(expiredTicketResult).toEqual({ success: true })
})
