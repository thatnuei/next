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

export const newMessageSound = createSoundEffect([
  `${process.env.PUBLIC_URL}/audio/notify.mp3`,
  `${process.env.PUBLIC_URL}/audio/notify.ogg`,
])
