import { AnyAction } from "redux"

export function mergeReducers<S, A extends AnyAction>(
  initialState: S,
  reducers: Array<(state: S, action: A) => S>,
) {
  return function reducer(state = initialState, action: A): S {
    for (const subReducer of reducers) {
      state = subReducer(state, action)
    }
    return state
  }
}
