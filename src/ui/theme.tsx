import { shade } from "polished"
import {
	createContext,
	CSSProperties,
	PropsWithChildren,
	useContext,
	useMemo,
	useState,
} from "react"
import { tw } from "twind"
import { clouds, midnight } from "../colors"

const themes = {
	midnight: {
		name: "Midnight",
		vars: {
			"--color-background-0": midnight,
			"--color-background-1": shade(0.3, midnight),
			"--color-background-2": shade(0.5, midnight),
			"--color-text": clouds,
		},
	},
	cloudy: {
		name: "Cloudy",
		vars: {
			"--color-background-0": clouds,
			"--color-background-1": shade(0.1, clouds),
			"--color-background-2": shade(0.2, clouds),
			"--color-text": shade(0.1, midnight),
		},
	},
}

export type ThemeName = keyof typeof themes

type ThemeContextType = {
	currentTheme: ThemeName
	setTheme: (name: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType>({
	currentTheme: "midnight",
	setTheme: () => {},
})

export function ThemeProvider({ children }: PropsWithChildren<{}>) {
	const [themeName, setThemeName] = useState<ThemeName>("midnight")
	const theme = themes[themeName]

	const contextValue = useMemo(
		() => ({ setTheme: setThemeName, currentTheme: themeName }),
		[themeName],
	)

	return (
		<ThemeContext.Provider value={contextValue}>
			<div className={tw`contents`} style={theme.vars as CSSProperties}>
				{children}
			</div>
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	return { ...context, themes }
}
