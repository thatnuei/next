export type Dict<T, K extends string | number | symbol = string> = {
  [_ in K]?: T
}

export type ValueOf<T> = T extends readonly (infer V)[] ? V : T[keyof T]

export type StringAutocompleteHack = string & { __autocompleteHack?: never }
