export function decodeHtml(input: string): string {
	const doc = new DOMParser().parseFromString(input, "text/html")
	return doc.documentElement.textContent ?? input
}