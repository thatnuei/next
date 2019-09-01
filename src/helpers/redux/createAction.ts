export function createAction<P = undefined>(type: string) {
  function actionCreator(...args: P extends undefined ? [] : [P]) {
    const payload = args[0]
    return { type, payload }
  }

  actionCreator.type = type

  actionCreator.is = (action: {
    type: string
  }): action is { type: string; payload: P } => action.type === type

  return actionCreator
}
