import { raise } from "../helpers/common/raise"
import { Dict } from "../helpers/common/types"

function createFormData(fields: Dict<unknown>) {
  const body = new FormData()
  for (const [name, value] of Object.entries(fields)) {
    if (value != null) body.set(name, String(value))
  }
  return body
}

type FetchJsonOptions = {
  body: Dict<unknown>
  method: "get" | "post" | "patch" | "put" | "delete"
}

export async function fetchJson<T>(
  url: string,
  options?: FetchJsonOptions,
): Promise<T> {
  const res = await fetch(url, {
    method: options?.method,
    body: options?.body && createFormData(options.body),
  })

  if (!res.ok) raise(res.statusText)

  const data = await res.json()
  if (data?.error) raise(data.error)
  return data
}
