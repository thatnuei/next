import * as React from "react"

type Props = {
  labelText: string
  children: React.ReactNode
}

function FormField({ labelText, children }: Props) {
  return (
    <label className={`block w-full`}>
      <div className={`mb-1 text-sm`}>{labelText}</div>
      {children}
    </label>
  )
}

export default FormField
