import { waitFor } from "@testing-library/react"
import { createTask } from "./task"

test("start & complete", async () => {
  const onStart = jest.fn()
  const onComplete = jest.fn()

  const task = createTask({
    run: () => Promise.resolve(123),
    onStart,
    onComplete,
  })

  task.run()

  await waitFor(() => {
    expect(onStart).toBeCalledTimes(1)
    expect(onComplete).toBeCalledWith(123)
  })
})

test("error", async () => {
  const onError = jest.fn()

  const task = createTask({
    run: () => Promise.reject(123),
    onError,
  })

  task.run()

  await waitFor(() => {
    expect(onError).toBeCalledTimes(1)
  })
})

test("cancel", async () => {
  const onStart = jest.fn()
  const onComplete = jest.fn()
  const onError = jest.fn()
  const onCancelled = jest.fn()

  const task = createTask({
    run: () => Promise.resolve(123),
    onStart,
    onComplete,
    onError,
    onCancelled,
  })

  task.run()
  task.cancel()

  await waitFor(() => {
    expect(onStart).toBeCalledTimes(1)
    expect(onComplete).toBeCalledTimes(0)
    expect(onError).toBeCalledTimes(0)
    expect(onCancelled).toBeCalledTimes(1)
  })
})
