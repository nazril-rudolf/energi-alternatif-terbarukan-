
const K = 'solarlab-progress-v1'

export const loadProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(K)) || {}
  } catch {
    return {}
  }
}

/** @param {Record<string, unknown>} p */
export const saveProgress = (p) => {
  try {
    localStorage.setItem(K, JSON.stringify(p))
  } catch {
    // Penyimpanan tidak tersedia
  }
}

export const resetProgress = () => {
  try {
    localStorage.removeItem(K)
  } catch {
    // Abaikan
  }
}
