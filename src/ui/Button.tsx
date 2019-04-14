import { Button as BaseButton } from "grommet"
import { shade } from "polished"
import { styled } from "./styled"
import { ThemeColor } from "./theme"

const Button = styled(BaseButton)`
  :hover {
    box-shadow: unset;

    background-color: ${({ theme }) =>
      shade(0.15, theme.global.colors[ThemeColor.primary])};

    border-color: ${({ theme }) =>
      shade(0.15, theme.global.colors[ThemeColor.primary])};
  }
`

export default Button
