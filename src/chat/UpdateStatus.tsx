import React, { useEffect, useState } from "react"
import { CharacterStatus } from "../character/types"
import Button from "../dom/Button"
import { input, select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"
import { alignItems, block, flex1, flexColumn, h, mb, p } from "../ui/style"

type Props = {
  initialValues: FormValues
  onSubmit: (values: FormValues) => void
}

type FormValues = {
  status: CharacterStatus
  statusMessage: string
}

function UpdateStatus(props: Props) {
  const [values, setValues] = useState(props.initialValues)

  const { status, statusMessage } = props.initialValues
  useEffect(() => {
    setValues({ status, statusMessage })
  }, [status, statusMessage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    props.onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField labelText="Status">
        <select
          value={values.status}
          onChange={(e) => {
            const status = e.target.value as CharacterStatus
            setValues((values) => ({ ...values, status }))
          }}>
          <option value="online">Online</option>
          <option value="looking">Looking</option>
          <option value="busy">Busy</option>
          <option value="away">Away</option>
          <option value="dnd">Do Not Disturb</option>
        </select>
      </FormField>
      <FormField labelText="Status message (optional)">
        <textarea
          value={values.statusMessage}
          onChange={(e) => {
            const statusMessage = e.target.value
            setValues((values) => ({ ...values, statusMessage }))
          }} />
      </FormField>
      <Button type="submit">
        Submit
      </Button>
    </form>
  );
}

export default UpdateStatus
