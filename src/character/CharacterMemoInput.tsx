import React, { useEffect, useMemo, useState } from "react"
import { merge, Subject } from "rxjs"
import { debounceTime, filter, map, scan } from "rxjs/operators"
import tw from "twin.macro"
import { useApiContext } from "../flist/api-context"
import { TagProps } from "../jsx/types"
import { input } from "../ui/components"

export default function CharacterMemoInput({
  name,
  ...props
}: { name: string } & TagProps<"textarea">) {
  const api = useApiContext()

  type State =
    | { status: "loading" }
    | { status: "editing"; name: string; note: string }
    | { status: "error" }

  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    let cancelled = false

    api
      .getMemo({ name })
      .then((note) => {
        if (cancelled) return
        setState({ status: "editing", name, note })
      })
      .catch(() => {
        if (cancelled) return
        setState({ status: "error" })
      })

    return () => {
      cancelled = true
      setState({ status: "loading" })
    }
  }, [api, name])

  type MemoData = { name: string; note: string }
  const memoInput$ = useMemo(() => new Subject<MemoData>(), [])
  useEffect(() => {
    const debouncedEntries = memoInput$.pipe(debounceTime(2000))

    const entriesWhereNameChanged = memoInput$.pipe(
      scan<MemoData, MemoData[]>((prev, next) => [...prev, next].slice(-2), []),
      filter(([prev, next]) => next && prev && next.name !== prev.name),
      map((entry) => entry[0]),
    )

    const sub = merge(debouncedEntries, entriesWhereNameChanged).subscribe(
      api.setMemo,
    )

    return () => sub.unsubscribe()
  }, [api.setMemo, memoInput$])

  const style = [input, tw`h-24 text-sm`]

  if (state.status === "loading") {
    return (
      <textarea
        css={[style, tw`italic`]}
        disabled
        placeholder="Loading..."
        {...props}
      />
    )
  }

  if (state.status === "editing") {
    return (
      <textarea
        css={[style, state.note === "" && tw`italic`]}
        value={state.note}
        onChange={(event) => {
          setState({ ...state, note: event.target.value })
          memoInput$.next({ name, note: event.target.value })
        }}
        placeholder="Enter a memo"
        {...props}
      />
    )
  }

  // TODO: error state + retry button(?)
  return null
}
