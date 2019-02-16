import css from "@emotion/css"
import React from "react"
import Button from "../ui/Button"
import { themeColor } from "../ui/colors"
import TextArea from "../ui/TextArea"

const Chatbox = () => {
  return (
    <form
      css={inputContainerStyle}
      onSubmit={(event) => event.preventDefault()}
    >
      <TextArea />
      <Button>Send</Button>
    </form>
  )
}
export default Chatbox

const inputContainerStyle = css`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${themeColor};
`
