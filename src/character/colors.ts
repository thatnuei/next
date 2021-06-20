import type { CharacterGender, CharacterStatus } from "./types"

export const genderColors: Record<CharacterGender, string> = {
	"Male": "hsla(216, 95%, 67%, 1)",
	"Female": "hsl(5, 90%, 78%)",
	"Transgender": "hsl(35, 65%, 60%)",
	"Shemale": "hsl(307, 63%, 72%)",
	"Herm": "hsl(266, 83%, 72%)",
	"Cunt-boy": "hsl(134, 56%, 60%)",
	"Male-Herm": "rgb(149, 239, 255)",
	"None": "rgb(227, 218, 145)",
}

export const statusColors: Record<CharacterStatus, string> = {
	online: "rgb(40, 170, 243)",
	looking: "rgba(32, 223, 108, 0.884)",
	busy: "rgb(255, 152, 0)",
	away: "rgb(255, 241, 118)",
	dnd: "rgb(198, 103, 93)",
	idle: "rgb(171, 124, 255)",
	offline: "rgba(214, 214, 214, 0.4)",
	crown: "white", // TODO
}
