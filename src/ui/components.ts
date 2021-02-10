import { tw } from "twind"
import { centerItems, flexRow, transition } from "./helpers"

const activePress = tw`active:transform active:translate-y-0.5 active:transition-none`

const fadedWhenDisabled = tw`disabled:opacity-50 disabled:pointer-events-none`

const baseControlStyle = tw(
	tw`px-3 py-2 bg-midnight-1 hover:bg-midnight-2`,
	transition,
	fadedWhenDisabled,
)

export const solidButton = tw(baseControlStyle, activePress)

export const fadedButton = tw(
	tw`opacity-50 hover:opacity-100 disabled:opacity-25`,
	transition,
	activePress,
)

export const input = tw(
	baseControlStyle,
	tw`w-full shadow-inner resize-none`,
	tw`focus:bg-midnight-2 focus:outline-none`,
	tw`disabled:pointer-events-none`,
	tw`placeholder-shown:italic`,
)

export const select = tw(baseControlStyle, activePress, transition, tw`w-full`)

export const headerText = tw`text-3xl font-light font-condensed`
export const headerText2 = tw`text-xl font-light font-condensed`

export const raisedPanel = tw`shadow-normal bg-midnight-0`

export const raisedPanelHeader = tw(
	tw`px-4 py-2 bg-midnight-1`,
	flexRow,
	centerItems,
)

export const anchor = tw(tw`underline opacity-50 hover:opacity-100`, transition)
