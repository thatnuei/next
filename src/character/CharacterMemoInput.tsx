import React, { useEffect, useMemo, useState } from "react"
import { merge, Observable, of, Subject } from "rxjs"
import {
  catchError,
  debounceTime,
  filter,
  map,
  scan,
  switchMap,
} from "rxjs/operators"
import tw from "twin.macro"
import Button from "../dom/Button"
import { useApiContext } from "../flist/api-context"
import { TagProps } from "../jsx/types"
import { input, solidButton } from "../ui/components"

function useObservable<T>(observable: Observable<T>, initialValue: T): T {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const sub = observable.subscribe(setValue)
    return () => sub.unsubscribe()
  }, [observable])

  return value
}

export default function CharacterMemoInput({
  name,
  ...props
}: { name: string } & TagProps<"textarea">) {
  const api = useApiContext()

  type Action =
    | { type: "loadMemo"; name: string }
    | { type: "setMemo"; name: string; note: string }

  type State =
    | { status: "loading" }
    | { status: "editing"; note: string }
    | { status: "error" }

  const actionSubject = useMemo(() => new Subject<Action>(), [])

  const loadMemoObservable = useMemo(
    () =>
      actionSubject.pipe(
        filter(
          (action): action is { type: "loadMemo"; name: string } =>
            action.type === "loadMemo",
        ),
        switchMap((action) =>
          merge(
            of<State>({ status: "loading" }),
            of(action.name).pipe(
              switchMap((name) => api.getMemo({ name })),
              map((note): State => ({ status: "editing", note })),
            ),
          ),
        ),
        catchError(() => of<State>({ status: "error" })),
      ),
    [actionSubject, api],
  )

  const state = useObservable(loadMemoObservable, { status: "loading" })

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

  useEffect(() => {
    actionSubject.next({ type: "loadMemo", name })
  }, [actionSubject, name])

  const style = [input, tw`h-20 text-sm`]

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
          // setState({ ...state, note: event.target.value })
          memoInput$.next({ name, note: event.target.value })
        }}
        placeholder="Enter a memo"
        {...props}
      />
    )
  }

  if (state.status === "error") {
    return (
      <div css={tw`text-sm`}>
        <div css={tw`mb-1`}>Failed to load memo</div>
        <Button
          css={[solidButton, tw`px-2 py-1 text-sm`]}
          onClick={() => actionSubject.next({ type: "loadMemo", name })}
        >
          Try again
        </Button>
      </div>
    )
  }

  return null
}
