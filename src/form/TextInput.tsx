import { observer } from "mobx-react-lite"
import React from "react"
import { TagProps } from "../jsx/types"
import { InputState } from "./InputState"

type Props = { state: InputState<string> } & TagProps<"input">

function TextInput({ state, ...props }: Props) {
  return (
    <input
      value={state.value}
      onChange={(event) => state.set(event.target.value)}
      {...props}
    />
  )
}

export default observer(TextInput)
