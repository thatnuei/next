export interface Dict<T> {
	readonly [key: string]: T
}

export interface TruthyMap {
	readonly [key: string]: boolean | undefined
}

export type ValueOf<T> = T extends readonly unknown[] ? T[number] : T[keyof T]

export type DeepReadonly<T> = T extends Record<string, unknown>
	? { readonly [K in keyof T]: DeepReadonly<T[K]> }
	: T
