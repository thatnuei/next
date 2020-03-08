import React from "react"
import Button from "../dom/Button"
import { input, select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import { alignItems, block, flex1, flexColumn, h, mb, p } from "../ui/style"

type Props = {}

function UpdateStatus(props: Props) {
  return (
    <form
      css={[p(3), flexColumn, alignItems("flex-start"), h("full")]}
      onSubmit={(e) => e.preventDefault()}
    >
      <FormField labelText="Status" css={[block, mb(3)]}>
        <select css={select}>
          <option value="online">Online</option>
          <option value="looking">Looking</option>
          <option value="busy">Busy</option>
          <option value="away">Away</option>
          <option value="dnd">Do Not Disturb</option>
        </select>
      </FormField>
      <FormField
        labelText="Status message (optional)"
        css={[mb(3), flex1, flexColumn]}
      >
        <textarea css={[input, flex1]}></textarea>
      </FormField>
      <Button type="submit" css={solidButton}>
        Submit
      </Button>
    </form>
  )
}

export default UpdateStatus
