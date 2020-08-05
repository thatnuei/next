import { debounce } from "lodash-es"
import React, { useMemo, useState } from "react"
import { queryCache, useMutation, useQuery } from "react-query"
import tw from "twin.macro"
import { TagProps } from "../jsx/types"
import { useRootStore } from "../root/context"
import { input } from "../ui/components"

type Props = {
  name: string
} & TagProps<"textarea">

export default function CharacterMemoInput({ name, ...props }: Props) {
  const root = useRootStore()

  const characterMemoKey = "characterMemo"

  const [memo, setMemo] = useState(
    queryCache.getQueryData<string>([characterMemoKey, name]),
  )

  const memoQuery = useQuery(
    [characterMemoKey, name],
    (_, name) => root.userStore.getMemo({ name }),
    { onSuccess: setMemo },
  )

  const [saveMemo] = useMutation(
    ({ name, note }: { name: string; note: string }) => {
      return root.userStore.setMemo({ name, note })
    },
    {
      onMutate: (note) => {
        queryCache.cancelQueries(characterMemoKey)
        queryCache.setQueryData(characterMemoKey, note)
      },

      onError: (error) => {
        console.log(error)
        // show toast?
      },

      onSettled: () => queryCache.invalidateQueries(characterMemoKey),
    },
  )

  const saveMemoDebounced = useMemo(() => debounce(saveMemo, 800), [saveMemo])

  function handleChange(note: string) {
    setMemo(note)
    void saveMemoDebounced({ name, note })
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
