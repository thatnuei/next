import { action, observable } from "mobx"

type Graph<State extends string, Event extends string> = {
  [_ in State]: {
    on?: {
      [_ in Event]?: State
    }
  }
}

type Options<State extends string, Event extends string> = {
  initial: State
  states: Graph<State, Event>
}

export default class StateMachine<State extends string, Event extends string> {
  @observable
  current: State = Object.keys(this.options.states)[0] as State

  constructor(private options: Options<State, Event>) {}

  @action
  dispatch = (event: Event) => {
    const events = this.options.states[this.current].on
    const newState = events && events[event]
    if (newState) {
      this.current = newState! // TS bug?
    }
  }
}
