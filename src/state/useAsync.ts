import { useMemo, useReducer } from "react"
import extractErrorMessage from "../common/extractErrorMessage"
import useIsMounted from "./useIsMounted"

type AsyncCallback<A extends unknown[]> = (...args: A) => Promise<unknown>

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

function useAsync() {
  const [state, dispatch] = useReducer(reducer, { loading: false })
  const isMounted = useIsMounted()

  return useMemo(() => {
    async function run<A extends unknown[]>(
      callback: AsyncCallback<A>,
      ...args: A
    ) {
      if (state.loading) return

      dispatch({ type: "loading" })

      try {
        await callback(...args)
        dispatch({ type: "success" })
      } catch (error) {
        // checking mounted status to avoid setting state when unmounted
        if (isMounted()) {
          dispatch({ type: "error", error: extractErrorMessage(error) })
        }
      }
    }

    function bind<A extends unknown[]>(callback: AsyncCallback<A>) {
      return (...args: A) => run(callback, ...args)
    }

    return { ...state, run, bind }
  }, [isMounted, state])
}

export default useAsync
