import { themeColor } from "./colors"
import { boxShadow } from "./helpers"
import { styled } from "./styled"

const Panel = styled.div<{ raised?: boolean }>`
  background-color: ${themeColor};
  ${(props) => props.raised && boxShadow};
`
export default Panel
