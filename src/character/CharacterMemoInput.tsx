import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { useApiContext } from "../flist/api-context"
import { debounce } from "../helpers/common/debounce"
import { TagProps } from "../jsx/types"
import { Task } from "../state/task"
import { input, solidButton } from "../ui/components"

type Props = {
  name: string
} & TagProps<"textarea">

type Status = "loading" | "editing" | "error"

export default function CharacterMemoInput({ name, ...props }: Props) {
  const api = useApiContext()

  const [status, setStatus] = useState<Status>("loading")
  const [memo, setMemo] = useState("")

  const taskRef = useRef<Task<string>>()

  const loadMemo = useCallback(
    (name: string) => {
      taskRef.current?.cancel()

      const task = (taskRef.current = new Task({
        run: () => api.getMemo({ name }),
        onStart() {
          setStatus("loading")
        },
        onComplete(memo) {
          setMemo(memo)
          setStatus("editing")
        },
        onError() {
          setStatus("error")
        },
        onCancelled() {
          setStatus("loading")
        },
      }))

      task.run()
    },
    [api],
  )

  const saveMemo = useMemo(
    () => debounce(2000, (note: string) => api.setMemo({ name, note })),
    [api, name],
  )

  useEffect(() => {
    loadMemo(name)
  }, [loadMemo, name])

  function handleChange(newMemo: string) {
    setMemo(newMemo)
    saveMemo(newMemo)
  }

  function retry() {
    loadMemo(name)
  }

  const style = [input, tw`h-20 text-sm`]

  if (status === "loading") {
    return (
      <textarea
        css={[style, tw`italic`]}
        disabled
        placeholder="Loading..."
        {...props}
      />
    )
  }

  if (status === "editing") {
    return (
      <textarea
        css={[style, memo === "" && tw`italic`]}
        value={memo}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Enter a memo"
        {...props}
      />
    )
  }

  if (status === "error") {
    return (
      <div css={tw`text-sm`}>
        <div css={tw`mb-1`}>Failed to load memo</div>
        <Button css={[solidButton, tw`px-2 py-1 text-sm`]} onClick={retry}>
          Try again
        </Button>
      </div>
    )
  }

  return null
}
