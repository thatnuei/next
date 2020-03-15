export type Dict<T> = { [_ in string]?: T }

export type StringAutocompleteHack = string & { __autocompleteHack?: never }
