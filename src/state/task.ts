type TaskOptions<T> = {
  run: () => Promise<T>
  onStart?: () => void
  onComplete?: (result: T) => void
  onError?: () => void
  onCancelled?: () => void
}

// TODO: convert to a hook probably
export class Task<T> {
  constructor(private readonly options: TaskOptions<T>) {}

  status: "idle" | "running" | "complete" | "error" | "cancelled" = "idle"

  run = () => {
    if (this.status !== "idle") return
    this.status = "running"
    this.options.onStart?.()

    this.options
      .run()
      .then((result) => {
        if (this.status === "cancelled") return
        this.status = "complete"
        this.options.onComplete?.(result)
      })
      .catch(() => {
        if (this.status === "cancelled") return
        this.status = "error"
        this.options.onError?.()
      })
  }

  cancel = () => {
    if (this.status !== "running") return
    this.status = "cancelled"
    this.options.onCancelled?.()
  }
}
