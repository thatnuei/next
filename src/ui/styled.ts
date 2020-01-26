import { css, keyframes } from "@emotion/core"
import baseStyled, { CreateStyled } from "@emotion/styled"
import { AppTheme } from "./theme"

export const styled = baseStyled as CreateStyled<AppTheme>
export { css, keyframes }
