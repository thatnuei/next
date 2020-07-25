import React, { useState } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { extractErrorMessage } from "../helpers/common/extractErrorMessage"
import { useRootStore } from "../root/context"
import { input, solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import { flexColumn } from "../ui/helpers"
import IslandLayout from "../ui/IslandLayout"

export type LoginResult = {
  account: string
  ticket: string
  characters: string[]
}

type State =
  | { current: "idle" }
  | { current: "loading" }
  | { current: "error"; error: string }

export default function Login() {
  const root = useRootStore()
  const [state, setState] = useState<State>({ current: "idle" })
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")

  const canSubmit =
    account !== "" && password !== "" && state.current !== "loading"

  const isFormDisabled = state.current === "loading"

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (state.current === "loading") return
    setState({ current: "loading" })

    root.appStore.submitLogin({ account, password }).catch((error) => {
      setState({ current: "error", error: extractErrorMessage(error) })
    })
  }

  return (
    <IslandLayout title="Login">
      <form css={[flexColumn, tw`items-start p-4`]} onSubmit={handleSubmit}>
        <FormField css={tw`mb-4`} labelText="Username">
          <input
            css={input}
            type="text"
            placeholder="awesome username"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            disabled={isFormDisabled}
          />
        </FormField>

        <FormField css={tw`mb-4`} labelText="Password">
          <input
            css={input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isFormDisabled}
          />
        </FormField>

        <Button css={solidButton} type="submit" disabled={!canSubmit}>
          Log in
        </Button>

        {state.current === "error" && (
          <p css={tw`max-w-xs mt-4`}>{state.error}</p>
        )}
      </form>
    </IslandLayout>
  )
}
