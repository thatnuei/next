export function createAction<P extends object = {}>(type: string) {
  function actionCreator(payload: P) {
    return { type, ...payload }
  }

  actionCreator.type = type

  actionCreator.is = (action: {
    type: string
  }): action is { type: string } & P => action.type === type

  return actionCreator
}
