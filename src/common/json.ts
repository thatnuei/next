export type Json =
	| string
	| number
	| boolean
	| null
	| Json[]
	| { [key: string]: Json }

export type JsonParseResult =
	| { result: Json; error?: undefined }
	| { result?: undefined; error: Error }

export function safeJsonParse(jsonString: string): JsonParseResult {
	try {
		return { result: JSON.parse(jsonString) as Json }
	} catch (error: unknown) {
		return { error: error instanceof Error ? error : new Error(String(error)) }
	}
}
