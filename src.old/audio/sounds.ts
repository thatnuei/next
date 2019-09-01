import notifyMp3 from "./notify.mp3"
import notifyOgg from "./notify.ogg"

function createSoundEffect(sources: string[]) {
  const sound = new Audio()
  sound.volume = 0.5

  for (const src of sources) {
    const source = document.createElement("source")
    source.src = src
    sound.append(source)
  }

  return {
    async play() {
      try {
        sound.currentTime = 0
        await sound.play()
      } catch {
        console.warn(`could not play sound ${sound.currentSrc}`)
      }
    },
  }
}

export const newMessageSound = createSoundEffect([notifyOgg, notifyMp3])
