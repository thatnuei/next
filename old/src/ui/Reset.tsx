import { Global } from "@emotion/react"
import React from "react"
import "tailwindcss/dist/base.css"
import tw from "twin.macro"

export default function Reset() {
  return (
    <Global
      styles={[
        {
          ":root": tw`text-base text-text bg-background-2 font-body`,
          "button, input, textarea, select": tw`text-left rounded-none`,
          "*": tw`min-w-0 min-h-0`,
        },
        {
          ":root": { wordBreak: "break-word", letterSpacing: "0.1px" },
          "button, input, textarea, select": { letterSpacing: "inherit" },
        },
      ]}
    />
  )
}