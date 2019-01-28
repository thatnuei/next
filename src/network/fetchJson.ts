type QueryObject = {
  [param in string]: string | boolean | number | void | null
}

type BodyObject = { [field in string]: string | boolean | number | void | null }

/**
 * Generates a query string from an object. The types of values are mapped as such:
 *
 * - value: 123 -> "value=123"
 * - value: "something" -> "value=something"
 * - value: "" -> "value="
 * - value: true -> "value"
 * - value: false -> ""
 * - value: null -> ""
 * - value: undefined -> ""
 */
function createQueryString(queryObject: QueryObject) {
  return Object.entries(queryObject)
    .filter(([, value]) => value != null && value !== false)
    .map(([key, value]) => (value === true ? key : `${key}=${value}`))
    .join("&")
}

function createFormData(bodyObject: BodyObject) {
  const data = new FormData()
  for (const [key, value] of Object.entries(bodyObject)) {
    data.set(key, String(value))
  }
  return data
}

interface FetchJsonOptions {
  method?: "get" | "post" | "patch"
  body?: BodyObject
  query?: QueryObject
}

export async function fetchJson<T = any>(
  endpoint: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { query, method, body } = options

  const queryString = query ? `?${createQueryString(query)}` : ""

  const formData = body && createFormData(body)

  const response = await fetch(`${endpoint}${queryString}`, {
    method,
    body: formData,
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error("Unknown network error")
  }

  if (data.error) {
    throw new Error(data.error)
  }

  return data
}
