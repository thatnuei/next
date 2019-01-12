/**
 * Lowercases letters and removes non-letter characters
 * to make it easier to match queries and searchable items in lists */
const queryify = (text: string) => text.replace(/[^a-z]+/gi, "").toLowerCase()
export default queryify
