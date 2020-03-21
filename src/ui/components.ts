import tw from "twin.macro"
import { centerItems, flexRow, transition } from "./helpers"

const activePress = tw`active:transform active:translate-y-px2 active:transition-none`

const fadedWhenDisabled = tw`disabled:opacity-50 disabled:pointer-events-none`

const baseControlStyle = [
  tw`px-3 py-2 bg-background-1 hover:bg-background-2`,
  transition,
  fadedWhenDisabled,
]

export const solidButton = [baseControlStyle, activePress]

export const fadedButton = [
  tw`opacity-50 hover:opacity-100 disabled:opacity-25`,
  transition,
  activePress,
]

export const input = [
  baseControlStyle,
  tw`w-full shadow-inner focus:bg-background-2 focus:outline-none`,
]

export const select = [
  baseControlStyle,
  activePress,
  transition,
  tw`w-full`,

  // for some reason, borderRadius: 0 still makes the default border show up,
  // but a really small border radius removes it
  { borderRadius: "0.00000001px" },
]

export const headerText = tw`font-header font-light text-3xl`
export const headerText2 = tw`font-header font-light text-2xl`

export const raisedPanel = tw`shadow-normal bg-background-0`

export const raisedPanelHeader = [
  tw`bg-background-1 px-4 py-2`,
  flexRow,
  centerItems,
]

export const anchor = [tw`opacity-50 hover:opacity-100 underline`, transition]
