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
  tw`w-full shadow-inner resize-none focus:bg-background-2 focus:outline-none disabled:pointer-events-none`,
]

export const select = [baseControlStyle, activePress, transition, tw`w-full`]

export const headerText = tw`text-2xl font-header font-weight-light`
export const headerText2 = tw`text-xl font-header font-weight-light`

export const raisedPanel = tw`shadow-normal bg-background-0`

export const raisedPanelHeader = [
  tw`px-4 py-2 bg-background-1`,
  flexRow,
  centerItems,
]

export const anchor = [tw`underline opacity-50 hover:opacity-100`, transition]
