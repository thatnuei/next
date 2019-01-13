import React from "react"
import { css } from "./styled"

const TextArea = (props: React.ComponentPropsWithoutRef<"textarea">) => (
  <textarea
    css={css`
      font: inherit;
      color: inherit;
      border: none;
      background: rgba(0, 0, 0, 0.5);
      padding: 0.5rem 0.7rem;
      transition: 0.2s background-color;
      display: block;
      resize: none;

      :focus {
        background: rgba(0, 0, 0, 0.8);
      }
    `}
    {...props}
  />
)
export default TextArea
