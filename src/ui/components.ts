import { apply } from "twind"

const activePress = apply`active:transform active:translate-y-0.5 active:transition-none`

const fadedWhenDisabled = apply`disabled:opacity-50 disabled:pointer-events-none`

const baseControlStyle = apply`
	px-3 py-2 bg-midnight-1 hover:bg-midnight-2 transition
	${fadedWhenDisabled}
`

export const solidButton = apply(baseControlStyle, activePress)

export const fadedButton = apply`
	opacity-50 hover:opacity-100 disabled:opacity-25 transition
	${activePress}
`

export const input = apply`
	${baseControlStyle}
	w-full shadow-inner resize-none
	focus:bg-midnight-2 focus:outline-none
	disabled:pointer-events-none
	placeholder-shown:italic
`

export const select = apply(baseControlStyle, activePress, `w-full transition`)

export const headerText = apply`text-3xl font-light font-condensed`
export const headerText2 = apply`text-xl font-light font-condensed`

export const raisedPanel = apply`shadow-normal bg-midnight-0`

export const raisedPanelHeader = apply`flex items-center justify-center px-4 py-2 bg-midnight-1`

export const anchor = apply`underline opacity-50 hover:opacity-100 transition`
