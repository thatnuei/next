import {
  ThemeProvider as BaseThemeProvider,
  useTheme as useBaseTheme,
} from "emotion-theming"
import React from "react"
import { AppTheme, baseTheme } from "./theme"

export function ThemeProvider(props: {
  theme: AppTheme
  children: React.ReactNode
}) {
  return (
    <BaseThemeProvider theme={props.theme}>
      <>{props.children}</>
    </BaseThemeProvider>
  )
}

export function useTheme() {
  return useBaseTheme<AppTheme>() ?? baseTheme
}
