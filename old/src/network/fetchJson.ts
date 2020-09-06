import { raise } from "../helpers/common/raise"
import { Dict } from "../helpers/common/types"

function createFormData(fields: Dict<unknown>) {
  const body = new FormData()
  for (const [name, value] of Object.entries(fields)) {
    if (value != null) body.set(name, String(value))
  }
  return body
}

export type FetchJsonOptions = {
  body: Dict<unknown>
  method: "get" | "post" | "patch" | "put" | "delete"
}

export async function fetchJson<T>(url: string, options?: FetchJsonOptions) {
  const res = await fetch(url, {
    method: options?.method,
    body: options?.body && createFormData(options.body),
  })

  return res.ok ? (res.json() as Promise<T>) : raise(res.statusText)
}
