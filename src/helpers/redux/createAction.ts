export function createAction<P = undefined>(type: string) {
  function actionCreator(...args: P extends undefined ? [] : [P]) {
    return { type, payload: args[0] }
  }

  actionCreator.type = type

  actionCreator.is = (action: {
    type: string
  }): action is { type: string } & P => action.type === type

  return actionCreator
}
