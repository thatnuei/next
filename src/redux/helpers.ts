import { AnyAction } from "redux"

export function createAction<
  T extends string,
  P extends object,
  A extends unknown[]
>(type: T, createPayload: (...args: A) => P) {
  function actionCreator(...args: A) {
    return { type, ...createPayload(...args) }
  }

  actionCreator.type = type

  actionCreator.is = (action: { type: string }): action is { type: T } & P =>
    action.type === type

  return actionCreator
}

export function createSimpleAction<T extends string>(type: T) {
  return createAction(type, () => ({}))
}

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
