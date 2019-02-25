import { shade } from "polished"
import { themeColor } from "./colors"
import { styled } from "./styled"

const PanelHeader = styled.h1`
  padding: 0.75rem 1.5rem;
  text-align: center;
  background-color: ${shade(0.2, themeColor)};
`
export default PanelHeader
