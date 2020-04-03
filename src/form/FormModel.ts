import { action, computed } from "mobx"
import { InputModel, InputModelType } from "./InputModel"

type FormModelFields = Record<string, InputModel<any>>

type FormModelValues<F extends FormModelFields> = {
  [K in keyof F]: InputModelType<F[K]>
}

export class FormModel<F extends FormModelFields> {
  constructor(readonly fields: F) {}

  @action
  reset() {
    for (const model of Object.values(this.fields)) {
      model.reset()
    }
  }

  @action
  hydrate(values: FormModelValues<F>) {
    for (const [key, value] of Object.entries(values)) {
      this.fields[key]?.set(value)
    }
  }

  @computed
  get values(): FormModelValues<F> {
    const values: any = {}
    for (const [key, model] of Object.entries(this.fields)) {
      values[key] = model.value
    }
    return values
  }
}
