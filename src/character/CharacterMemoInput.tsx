import { debounce } from "lodash/fp"
import React, { useMemo } from "react"
import { atomFamily, useRecoilValueLoadable, useSetRecoilState } from "recoil"
import tw from "twin.macro"
import { useApiContext } from "../flist/api-context"
import { TagProps } from "../jsx/types"
import { input } from "../ui/components"

type Props = {
  name: string
} & TagProps<"textarea">

export default function CharacterMemoInput({ name, ...props }: Props) {
  const api = useApiContext()

  const characterMemoSelector = useMemo(() => {
    return atomFamily({
      key: "character:memo",
      default: (name: string) => api.getMemo({ name }),
    })
  }, [api])

  const setMemo = useSetRecoilState(characterMemoSelector(name))
  const memoLoadable = useRecoilValueLoadable(characterMemoSelector(name))

  const saveMemoDebounced = useMemo(
    () => debounce(2000, (note: string) => api.setMemo({ name, note })),
    [api, name],
  )

  function handleChange(newMemo: string) {
    setMemo(newMemo)
    saveMemoDebounced(newMemo)
  }

  const style = [input, tw`h-20 text-sm`]

  if (memoLoadable.state === "loading") {
    return <textarea css={style} disabled placeholder="Loading..." {...props} />
  }

  if (memoLoadable.state === "hasValue") {
    return (
      <textarea
        css={style}
        value={memoLoadable.contents}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Enter a memo"
        {...props}
      />
    )
  }

  if (memoLoadable.state === "hasError") {
    return <p css={tw`text-sm`}>Failed to load memo</p>
  }

  return null
}
