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

export function getAvatarUrl(name: string) {
	return `https://static.f-list.net/images/avatar/${lowerEncode(name)}.png`
}

export function getProfileUrl(name: string) {
	return `https://www.f-list.net/c/${lowerEncode(name)}`
}

export function getIconUrl(name: string) {
	return `https://static.f-list.net/images/eicon/${lowerEncode(name)}.gif`
}

const lowerEncode = (text: string) => encodeURI(text.toLowerCase())
