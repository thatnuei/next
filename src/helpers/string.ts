/**
 * Lowercases letters and removes white space
 * to make it easier to match queries and searchable items in lists */
export const queryify = (text: string) => text.toLowerCase().replace(/\s+/g, "")
