import { debounce } from "lodash/fp"
import React, { useMemo, useState } from "react"
import { useQuery } from "react-query"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import { input } from "../ui/components"

type Props = {
  name: string
} & TagProps<"textarea">

export default function CharacterMemoInput({ name, ...props }: Props) {
  const root = useRootStore()
  const [memo, setMemo] = useState("")

  const memoQuery = useQuery(
    ["characterMemo", name],
    (_, name) => root.userStore.getMemo({ name }),
    { onSuccess: setMemo },
  )

  const saveMemoDebounced = useMemo(
    () =>
      debounce(2000, (note: string) => root.userStore.setMemo({ name, note })),
    [name, root.userStore],
  )

  function handleChange(newMemo: string) {
    setMemo(newMemo)
    saveMemoDebounced(newMemo)
  }

  const style = [input, tw`h-20 text-sm`]

  if (memoQuery.status === "loading") {
    return (
      <textarea
        css={style}
        disabled
        placeholder="Loading..."
        value=""
        {...props}
      />
    )
  }

  if (memoQuery.status === "success") {
    return (
      <textarea
        css={style}
        value={memo}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Enter a memo"
        {...props}
      />
    )
  }

  if (memoQuery.status === "error") {
    return <p css={tw`text-sm`}>Failed to load memo</p>
  }

  return null
}
