import { css, keyframes } from "@emotion/react"
import tw from "twin.macro"

export const fixedCover = tw`fixed top-0 bottom-0 left-0 right-0`
export const absoluteCover = tw`absolute top-0 bottom-0 left-0 right-0`

export const flexRow = tw`flex`
export const flexColumn = tw`flex flex-col`

export const centerItems = tw`items-center justify-center`

export const transition = tw`transition duration-300`

export const scrollVertical = tw`min-h-0 overflow-y-auto`

export const ellipsize = css({
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
})

const rainbow = keyframes`
  from {
    color: #6666ff;
  }
  10% {
    color: #0099ff;
  }
  50% {
    color: #00ff00;
  }
  75% {
    color: #ff3399;
  }
  100% {
    color: #6666ff;
  }
`

export const rainbowAnimation = css({ animation: `${rainbow} 5s infinite` })
