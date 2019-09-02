/// <reference types="styled-components/cssprop" />
import * as sc from "styled-components"
import { AppTheme } from "./theme"

export const {
  default: styled,
  css,
  keyframes,
  ThemeContext,
  ThemeProvider: StyledThemeProvider,
  createGlobalStyle,
} = sc as sc.ThemedStyledComponentsModule<AppTheme>
