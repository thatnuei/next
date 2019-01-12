import { styled } from "./styled"

export const StripedRow = styled.div`
  &:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0.3);
  }
`
