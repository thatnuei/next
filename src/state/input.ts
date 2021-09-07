export type InputState = {
  history: string[]
  index: number
}

export function createInputState(initialValue = ""): InputState {
  return {
    history: [initialValue],
    index: 0,
  }
}

export function setInputStateValue(
  state: InputState,
  newValue: string,
): InputState {
  return {
    ...state,
    history: [...state.history.slice(0, state.index + 1), newValue],
    index: state.index + 1,
  }
}

export function inputStateUndo(state: InputState): InputState {
  return state.index > 0 ? { ...state, index: state.index - 1 } : state
}

export function inputStateRedo(state: InputState): InputState {
  return state.index < state.history.length - 1
    ? { ...state, index: state.index + 1 }
    : state
}

export function getInputStateValue(state: InputState): string {
  return state.history[state.index] ?? ""
}
