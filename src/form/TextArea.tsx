import { observer } from "mobx-react-lite"
import React from "react"
import { TagProps } from "../jsx/types"
import { InputModel } from "./InputModel"

type Props = { model: InputModel<string> } & TagProps<"textarea">

function TextArea({ model, ...props }: Props) {
  return (
    <textarea
      value={model.value}
      onChange={(event) => model.set(event.target.value)}
      {...props}
    />
  )
}

export default observer(TextArea)
