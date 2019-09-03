import { styled } from "../styled"
import { shadows } from "../theme"

const RaisedPanel = styled.div`
  background-color: ${({ theme }) => theme.colors.theme0};
  margin: auto;
  box-shadow: ${shadows.normal};
  max-width: 300px;
`

export default RaisedPanel
