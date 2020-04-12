import { observer } from "mobx-react-lite"
import React from "react"
import { TagProps } from "../jsx/types"
import { InputState } from "./InputState"

type Props = { state: InputState<string> } & TagProps<"textarea">

function TextArea({ state, ...props }: Props) {
  return (
    <textarea
      value={state.value}
      onChange={(event) => state.set(event.target.value)}
      {...props}
    />
  )
}

export default observer(TextArea)
