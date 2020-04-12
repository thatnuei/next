import { action, computed } from "mobx"
import { InputState, InputStateType } from "./InputState"

type FormStateFields = Record<string, InputState<any>>

type FormStateValues<F extends FormStateFields> = {
  [K in keyof F]: InputStateType<F[K]>
}

export class FormState<F extends FormStateFields> {
  constructor(readonly fields: F) {}

  @action
  reset() {
    for (const model of Object.values(this.fields)) {
      model.reset()
    }
  }

  @action
  hydrate(values: FormStateValues<F>) {
    for (const [key, value] of Object.entries(values)) {
      this.fields[key]?.set(value)
    }
  }

  @computed
  get values(): FormStateValues<F> {
    const values: any = {}
    for (const [key, model] of Object.entries(this.fields)) {
      values[key] = model.value
    }
    return values
  }
}
