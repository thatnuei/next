import { useState } from "react"

export default function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue)
  return {
    value,
    setValue,
    bind: {
      value,
      onChange(event: React.ChangeEvent<{ value: string }>) {
        setValue(event.currentTarget.value)
      },
    },
  }
}
