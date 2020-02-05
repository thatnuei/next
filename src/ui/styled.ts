import { css, keyframes } from "@emotion/core"
import baseStyled, { CreateStyled } from "@emotion/styled"
import { AppTheme } from "./theme"

export { css, keyframes }

/** @deprecated we wanna try to go all-on on the css prop */
export const styled: CreateStyled<AppTheme> = baseStyled
