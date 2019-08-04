import React from "react"
import { keyframes, styled } from "./styled"

type Props = { size?: string | number }

function LoadingIcon({ size = "1em", ...props }: Props) {
  const realSize = typeof size === "number" ? `${size * 1.5}rem` : size

  return (
    <Svg width={realSize} height={realSize} viewBox="0 0 100 100">
      <Circle
        cx={50}
        cy={50}
        r={30}
        fill="none"
        strokeWidth={10}
        stroke="currentColor"
        strokeDasharray={`${20 * Math.PI} ${40 * Math.PI}`}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default LoadingIcon

const spin = keyframes`
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: ${60 * Math.PI};
  }
`

const Svg = styled.svg`
  vertical-align: -8%;
`

const Circle = styled.circle`
  animation: ${spin} 0.8s infinite;
`
