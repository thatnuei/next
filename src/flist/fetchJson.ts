import { Dict } from "../common/types"

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

export async function fetchJson(url: string, options?: FetchJsonOptions) {
  const res = await fetch(url, {
    method: options?.method,
    body: options?.body && createFormData(options.body),
  })

  const data = await res.json()

  if (data?.error) {
    throw new Error(data.error)
  }

  return data
}
