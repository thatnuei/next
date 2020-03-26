import { Global } from "@emotion/react"
import React from "react"
import "tailwindcss/dist/base.css"
import tw from "twin.macro"

export default function Reset() {
  return (
    <Global
      styles={{
        ":root": tw`text-text bg-background-2 font-body`,
        "button, input, textarea, select": tw`rounded-none text-left`,
      }}
    />
  )
}
