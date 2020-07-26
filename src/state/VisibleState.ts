import { observable } from "micro-observables"

export class VisibleState {
  private readonly isVisibleWritable = observable(false)
  readonly isVisible = this.isVisibleWritable.readOnly()
  show = () => this.isVisibleWritable.set(true)
  hide = () => this.isVisibleWritable.set(false)
  toggle = () => this.isVisibleWritable.update((v) => !v)
}
