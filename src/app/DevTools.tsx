import React, { useState } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import { fadedButton, select } from "../ui/components"
import FormField from "../ui/FormField"
import Icon from "../ui/Icon"
import { code } from "../ui/icons"
import { ThemeName, useTheme } from "../ui/theme"

function DevTools() {
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => setVisible((v) => !v)

  const { themes, currentTheme, setTheme } = useTheme()

  return (
    <>
      {visible && (
        <div css={tw`fixed top-0 left-0 right-0 bg-shade p-4 text-white`}>
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
      )}
      <div css={tw`fixed top-0 right-0 bg-shade`}>
        <Button css={[tw`block p-2`, fadedButton]} onClick={toggleVisible}>
          <Icon which={code} size={4} />
        </Button>
      </div>
    </>
  )
}

export default DevTools
