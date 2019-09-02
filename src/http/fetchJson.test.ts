import { fetchJson } from "./fetchJson"

const createMockResponse = (data: any) => ({
  json: async () => data,
  ok: data != null,
})

const mockFetch = async (input: string, init: RequestInit = {}) => {
  if (input === "/ping") {
    return createMockResponse("pong")
  }

  if (
    input === "/body" &&
    init.body instanceof FormData &&
    init.body.has("message")
  ) {
    return createMockResponse(init.body.get("message"))
  }

  if (input === "/method") {
    return createMockResponse(init.method)
  }

  if (input.startsWith("/query")) {
    const url = new URL(input, "http://localhost")
    return createMockResponse(url.search)
  }

  if (input === "/error") {
    return createMockResponse({ error: "oops" })
  }

  return createMockResponse(null)
}

let realFetch: GlobalFetch["fetch"]

beforeEach(() => {
  realFetch = window.fetch
  window.fetch = mockFetch as any
})

afterEach(() => {
  window.fetch = realFetch
})

test("no options", async () => {
  const res = await fetchJson(`/ping`)
  expect(res).toEqual("pong")
})

test("body", async () => {
  const res = await fetchJson(`/body`, { body: { message: "hi mom" } })
  expect(res).toBe("hi mom")
})

test("method", async () => {
  expect(await fetchJson(`/method`, { method: "get" })).toBe("get")
  expect(await fetchJson(`/method`, { method: "post" })).toBe("post")
  expect(await fetchJson(`/method`, { method: "patch" })).toBe("patch")
})

test("query", async () => {
  const query = {
    value: 123,
    string: "hello",
    empty: "",
    existing: true,
    falsy: false,
    isNull: null,
    isUndefined: undefined,
  }

  const output = "?value=123&string=hello&empty=&existing"

  expect(await fetchJson(`/query`, { query })).toBe(output)
})

test("errors if response object has error field", async () => {
  expect(fetchJson(`/error`)).rejects.toHaveProperty("message", "oops")
})

test("errors if response is not ok", async () => {
  expect(fetchJson(`/nope`)).rejects.toHaveProperty(
    "message",
    "Unknown network error",
  )
})
