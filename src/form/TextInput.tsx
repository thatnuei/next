import { observer } from "mobx-react-lite"
import React from "react"
import { TagProps } from "../jsx/types"
import { InputModel } from "./InputModel"

type Props = { model: InputModel<string> } & TagProps<"input">

function TextInput({ model, ...props }: Props) {
  return (
    <input
      value={model.value}
      onChange={(event) => model.set(event.target.value)}
      {...props}
    />
  )
}

export default observer(TextInput)
