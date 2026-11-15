
// Narasi suara bahasa Indonesia memakai Web Speech API (jika didukung browser).

export const canSpeak = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window

/**
 * @param {string} text
 * @param {number} [volume=1]
 */
export function speak(text, volume = 1) {
  if (!canSpeak()) return

  speechSynthesis.cancel()

  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'id-ID'
  u.volume = volume

  speechSynthesis.speak(u)
}

export const stopSpeak = () => {
  if (canSpeak()) {
    speechSynthesis.cancel()
  }
}
