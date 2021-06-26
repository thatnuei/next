import { raise } from "../common/raise"
import type { Dict } from "../common/types"
import { fetchJson } from "../network/fetchJson"

export async function fetchFlist<T>(
	endpoint: string,
	body: Dict<unknown>,
): Promise<T> {
	endpoint = endpoint.replace(/^\/+/, "")

	const data = await fetchJson<T & { error?: string }>(
		`https://www.f-list.net/json/${endpoint}`,
		{
			method: "post",
			body,
		},
	)

	return data.error ? raise(data.error) : data
}
