import React, { useState } from "react"
import tw from "twin.macro"
import { useWindowEvent } from "../dom/useWindowEvent"
import { select } from "../ui/components"
import FormField from "../ui/FormField"
import { ThemeName, useTheme } from "../ui/theme"

function DevTools() {
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => setVisible((v) => !v)

  const { themes, currentTheme, setTheme } = useTheme()

  useWindowEvent("keypress", (event) => {
    if (event.key === "~" && event.shiftKey) {
      toggleVisible()
    }
  })

  return visible ? (
    <div css={tw`fixed top-0 left-0 right-0 p-4 text-white bg-black-faded`}>
      <FormField labelText="Theme">
        <select
          css={[select, tw`text-text`]}
          value={currentTheme}
          onChange={(e) => setTheme(e.target.value as ThemeName)}
        >
          {Object.entries(themes).map(([id, { name }]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  ) : null
}

export default DevTools
