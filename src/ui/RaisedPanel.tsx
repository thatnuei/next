import { themeColor } from "./colors"
import { boxShadow } from "./helpers"
import { styled } from "./styled"

const RaisedPanel = styled.div`
  background-color: ${themeColor};
  ${boxShadow};
`
export default RaisedPanel
