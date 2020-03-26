import React, { useEffect, useState } from "react"
import tw from "twin.macro"
import { CharacterStatus } from "../character/types"
import Button from "../dom/Button"
import { input, select, solidButton } from "../ui/components"
import FormField from "../ui/FormField"

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
    <form
      css={tw`p-3 flex flex-col items-start h-full`}
      onSubmit={handleSubmit}
    >
      <FormField labelText="Status" css={tw`block mb-3`}>
        <select
          css={select}
          value={values.status}
          onChange={(e) => {
            const status = e.target.value as CharacterStatus
            setValues((values) => ({ ...values, status }))
          }}
        >
          <option value="online">Online</option>
          <option value="looking">Looking</option>
          <option value="busy">Busy</option>
          <option value="away">Away</option>
          <option value="dnd">Do Not Disturb</option>
        </select>
      </FormField>
      <FormField
        labelText="Status message (optional)"
        css={tw`mb-3 flex-1 flex flex-col`}
      >
        <textarea
          css={[input, tw`flex-1`]}
          value={values.statusMessage}
          onChange={(e) => {
            const statusMessage = e.target.value
            setValues((values) => ({ ...values, statusMessage }))
          }}
        />
      </FormField>
      <Button type="submit" css={solidButton}>
        Submit
      </Button>
    </form>
  )
}

export default UpdateStatus
