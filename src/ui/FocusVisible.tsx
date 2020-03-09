import { Global } from "@emotion/core"
import "focus-visible"
import React from "react"

export default function FocusVisible() {
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
