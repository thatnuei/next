function createSoundEffect(sources: string[]) {
  const sound = new Audio()

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
  `/public/audio/notify.ogg`,
  `/public/audio/notify.mp3`,
])