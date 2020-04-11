import { observable } from "mobx"

export type Task = {
  status: "idle" | "running" | "complete" | "error" | "cancelled"
  run(): void
  cancel(): void
}

export type TaskOptions<T> = {
  run: () => Promise<T>
  onStart?: () => void
  onComplete?: (result: T) => void
  onError?: () => void
  onCancelled?: () => void
}

export function createTask<T>(options: TaskOptions<T>) {
  const task = observable<Task>({
    status: "idle",
    run() {
      if (task.status !== "idle") return
      task.status = "running"
      options.onStart?.()

      options
        .run()
        .then((result) => {
          if (task.status === "cancelled") return
          task.status = "complete"
          options.onComplete?.(result)
        })
        .catch(() => {
          if (task.status === "cancelled") return
          task.status = "error"
          options.onError?.()
        })
    },
    cancel() {
      if (task.status !== "running") return
      task.status = "cancelled"
      options.onCancelled?.()
    },
  })
  return task
}
