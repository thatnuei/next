export async function flistFetch<T>(
	endpoint: string,
	data: Record<string, string | number>,
): Promise<T> {
	const body = new FormData()
	for (const [key, value] of Object.entries(data)) {
		body.set(key, String(value))
	}

	const response = await fetch(
		`https://www.f-list.net/${endpoint.replace(/^\/+/, "")}`,
		{ method: "post", body },
	)

	if (!response.ok) {
		throw new Error(response.statusText)
	}

	const { error, ...responseData } = await response.json()
	if (error) throw new Error(error)

	return responseData
}