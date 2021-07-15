import clsx from "clsx"

const activePress = `active:transform active:translate-y-0.5 active:transition-none`

const fadedWhenDisabled = `disabled:opacity-50 disabled:pointer-events-none`

const baseControlStyle = `
	px-3 py-2 bg-midnight-1 hover:bg-midnight-2 transition
	${fadedWhenDisabled}
`

export const solidButton = `${baseControlStyle} ${activePress}`

export const fadedButton = `
	opacity-50 hover:opacity-100 disabled:opacity-25 transition
	${activePress}
`

export const input = clsx`
	${baseControlStyle}
	w-full shadow-inner resize-none
	focus:bg-midnight-2 focus:outline-none
	disabled:pointer-events-none
	placeholder-shown:italic
`

export const select = `${baseControlStyle} ${activePress} w-full transition`

export const headerText = `text-3xl font-light font-condensed`
export const headerText2 = `text-2xl font-light font-condensed`

export const raisedPanel = `shadow-normal bg-midnight-0`

export const raisedPanelHeader = `flex items-center justify-center px-4 py-2 bg-midnight-1`

export const anchor = `underline opacity-50 hover:opacity-100 transition`
