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
