type ReducerMap = {
  [_ in string]: (...args: any[]) => unknown
}

export type StateFromReducerMap<RM extends ReducerMap> = {
  [K in keyof RM]: ReturnType<RM[K]>
}
