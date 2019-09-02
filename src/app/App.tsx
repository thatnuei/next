import React from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { showCharacterSelect, showLogin } from "../store/navigation/actions"
import { getNavigationRoute } from "../store/navigation/selectors"

function App() {
  const route = useAppSelector(getNavigationRoute)
  const dispatch = useAppDispatch()
  return (
    <main>
      <p>{route.type}</p>
      <button onClick={() => dispatch(showLogin())}>go to login</button>
      <button onClick={() => dispatch(showCharacterSelect())}>
        go to char select
      </button>
    </main>
  )
}

export default App
