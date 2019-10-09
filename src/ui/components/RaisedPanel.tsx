import { styled } from "../styled"
import { getThemeColor, shadows } from "../theme"

const RaisedPanel = styled.div`
  background-color: ${getThemeColor('theme0')};
  box-shadow: ${shadows.normal};
  max-width: 300px;
`

export default RaisedPanel
