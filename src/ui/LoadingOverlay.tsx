import { css, keyframes } from "@emotion/react"
import React from "react"
import tw from "twin.macro"
import { headerText2 } from "./components"
import { centerItems, fixedCover, flexColumn } from "./helpers"

type Props = { text: string; visible: boolean }

function LoadingOverlay(props: Props) {
  const dotStyle = tw`w-4 h-4 bg-white rounded-full`
  return (
    <div
      css={[
        fixedCover,
        flexColumn,
        centerItems,
        tw`transition-all duration-300 bg-black-faded`,
        props.visible ? tw`visible opacity-100` : tw`invisible opacity-0`,
      ]}
    >
      <div css={[tw`grid grid-cols-2 grid-rows-2 gap-4 p-4`, spinAnimation]}>
        <div css={[dotStyle, tw`bg-blue`]}></div>
        <div css={dotStyle}></div>
        <div css={dotStyle}></div>
        <div css={[dotStyle, tw`bg-blue`]}></div>
      </div>
      <p css={headerText2}>{props.text}</p>
    </div>
  )
}

export default LoadingOverlay

const turn = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(calc(270deg * 1));
  }
  50% {
    transform: rotate(calc(270deg * 2));
  }
  75% {
    transform: rotate(calc(270deg * 3));
  }
  100% {
    transform: rotate(calc(270deg * 4));
  }
`

const spinAnimation = css({
  animation: `${turn} 3.7s infinite`,
})
