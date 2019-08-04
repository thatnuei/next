import React from "react"
import { css, keyframes, styled } from "./styled"

type Props = {}

function LoadingSpinner(props: Props) {
  return (
    <Container>
      <Dot
        css={css`
          animation: ${bounce} 0.5s infinite alternate;
          animation-delay: 0.1s;
        `}
      />
      <Dot
        css={css`
          animation: ${bounce} 0.5s infinite alternate;
          animation-delay: 0.25s;
        `}
      />
      <Dot
        css={css`
          animation: ${bounce} 0.5s infinite alternate;
          animation-delay: 0.4s;
        `}
      />
    </Container>
  )
}

export default LoadingSpinner

const bounce = keyframes`
  0% {
    transform: translateY(80%);
  }
  100% {
    transform: translateY(-80%);
  }
`

const Container = styled.div`
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: space-evenly;

  opacity: 0.7;
`

const Dot = styled.div`
  width: 15%;
  height: 15%;
  border-radius: 50%;
  background-color: currentColor;
`
