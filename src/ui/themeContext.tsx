import React from "react"
import { useRequiredContext } from "../helpers/react/useRequiredContext"
import { StyledThemeProvider, ThemeContext } from "./styled"
import { AppTheme } from "./theme"

export function ThemeProvider(props: {
  theme: AppTheme
  children: React.ReactNode
}) {
  return (
    <StyledThemeProvider theme={props.theme}>
      <>{props.children}</>
    </StyledThemeProvider>
  )
}

export function useTheme() {
  return useRequiredContext(ThemeContext as any, "ThemeProvider not found")
}
