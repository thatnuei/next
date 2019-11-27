import inputBase from "../inputBase"
import { styled } from "../styled"

const Select = styled.select`
  ${inputBase};

  /* the select seems to have some extra left padding for some reason */
  padding-left: 0.4rem;

  /* box shadow on a select looks weird */
  box-shadow: none;
`
export default Select
