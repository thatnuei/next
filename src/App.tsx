import React, { useState } from "react"
import Login from "./Login"

type AppScreen = "login" | "character-select"

function App() {
  const [screen, setScreen] = useState<AppScreen>("login")

  const handleLoginSuccess = () => {
    setScreen("character-select")
  }

  switch (screen) {
    case "login":
      return <Login onSuccess={handleLoginSuccess} />
    case "character-select":
      return <p>select a character</p>
  }
}

export default App
