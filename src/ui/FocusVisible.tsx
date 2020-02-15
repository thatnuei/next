import { Global } from "@emotion/react"
import "focus-visible"
import React from "react"

export function FocusVisible() {
  return (
    <Global
      styles={{
        ".js-focus-visible :focus:not(.focus-visible)": {
          outline: "none",
        },
        ".js-focus-visible :focus:not([data-focus-visible-added])": {
          outline: "none",
        },
      }}
    />
  )
}
