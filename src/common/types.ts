export type Dict<T> = { [_ in string]?: T }

export type ValueOf<T> = T extends readonly (infer V)[] ? V : T[keyof T]

export type StringAutocompleteHack = string & { __autocompleteHack?: never }
