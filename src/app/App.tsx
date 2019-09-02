import React from "react"
import { useAppSelector } from "../store/hooks"
import { getNavigationRoute } from "../store/navigation/selectors"
import Login from "./Login"

function App() {
  const route = useAppSelector(getNavigationRoute)

  switch (route.type) {
    case "login":
      return <Login />
    case "characterSelect":
      return <>characterSelect</>
    case "chat":
      return <>chat</>
  }

  return null
}

export default App
