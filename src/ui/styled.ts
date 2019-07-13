/// <reference types="styled-components/cssprop" />
import baseStyled, {
  createGlobalStyle as SCcreateGlobalStyle,
  css as SCcss,
  keyframes,
  ThemeContext as SCThemeContext,
  ThemedStyledComponentsModule,
  ThemeProvider,
} from "styled-components/macro"
import { AppTheme } from "./theme"

type ThemedModule = ThemedStyledComponentsModule<AppTheme>

export const styled = baseStyled as ThemedModule["default"]
export const css = SCcss as ThemedModule["css"]
export const ThemeContext = SCThemeContext as ThemedModule["ThemeContext"]
export const StyledThemeProvider = ThemeProvider as ThemedModule["ThemeProvider"]
export const createGlobalStyle = SCcreateGlobalStyle as ThemedModule["createGlobalStyle"]
export { keyframes }
