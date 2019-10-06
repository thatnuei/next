import { useEffect } from "react"
import createContextWrapper from "./react/helpers/createContextWrapper"
import RootStore from "./RootStore"
import useInstanceValue from "./state/hooks/useInstanceValue"

const useRootStore = createContextWrapper(() => {
  const store = useInstanceValue(() => new RootStore())

  useEffect(() => {
    store.initialize()
  }, [store])

  return store
})

export default useRootStore
