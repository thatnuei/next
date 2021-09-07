export type InputState = {
  history: string[]
  index: number
}

const historyLimit = 1000

export function createInputState(initialValue = ""): InputState {
  return {
    history: [initialValue],
    index: 0,
  }
}

export function setInputStateValue(
  state: InputState,
  newValue: string,
  { replace = false } = {},
): InputState {
  // if the new input is the same as the current input, do nothing
  const value = getInputStateValue(state)
  if (value === newValue) {
    return state
  }

  // limit the history to a set number of items
  const newHistory = [
    ...state.history.slice(0, state.index + (replace ? 0 : 1)),
    newValue,
  ].slice(-historyLimit)

  return {
    ...state,
    history: newHistory,
    index: Math.min(state.index + 1, newHistory.length - 1),
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
