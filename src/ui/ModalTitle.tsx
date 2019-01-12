import { shade } from "polished"
import { appColor } from "./colors"
import { styled } from "./styled"

const ModalTitle = styled.h1`
  padding: 0.75rem 1.5rem;
  text-align: center;
  background-color: ${shade(0.2, appColor)};
`
export default ModalTitle
