import { useEffect, useMemo, useReducer, useRef } from "react"
import extractErrorMessage from "../common/extractErrorMessage"
import useIsMounted from "./useIsMounted"

type AsyncState = {
  loading: boolean
  error?: string
}

type AsyncAction =
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; error: string }

function reducer(_: AsyncState, action: AsyncAction): AsyncState {
  switch (action.type) {
    case "loading":
      return { loading: true }
    case "success":
      return { loading: false }
    case "error":
      return { loading: false, error: action.error }
  }
}

function useAsyncReducer() {
  return useReducer(reducer, { loading: false })
}

function useAsyncCallback<A extends unknown[]>(
  callback: (...args: A) => Promise<unknown>,
) {
  const [state, dispatch] = useAsyncReducer()
  const isMounted = useIsMounted()

  // we want to ref the callback to avoid useMemo invalidating every render
  // if an inline callback is passed
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useMemo(() => {
    async function run(...args: A) {
      if (state.loading) return

      dispatch({ type: "loading" })

      try {
        await callbackRef.current(...args)
        dispatch({ type: "success" })
      } catch (error) {
        // checking mounted status to avoid setting state when unmounted
        if (isMounted()) {
          dispatch({ type: "error", error: extractErrorMessage(error) })
        }
      }
    }

    const buttonProps = {
      onClick: run,
      disabled: state.loading,
    }

    return { ...state, run, buttonProps }
  }, [dispatch, isMounted, state])
}

export default useAsyncCallback
