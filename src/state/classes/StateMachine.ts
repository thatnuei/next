import { action, observable } from "mobx"

type StateGraph<State extends string, Event extends string> = {
  [_ in State]: {
    on?: {
      [_ in Event]?: State
    }
  }
}

type Options<State extends string, Event extends string> = {
  initial: State
  states: StateGraph<State, Event>
}

export default class StateMachine<State extends string, Event extends string> {
  @observable
  current = this.options.initial

  constructor(private options: Options<State, Event>) {}

  @action
  dispatch = (event: Event) => {
    const events = this.options.states[this.current].on
    const newState = events?.[event]
    if (newState) {
      this.current = newState! // TS bug?
    }
  }
}
