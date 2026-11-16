let activeStop = null

// Cada reproductor entrega cómo detenerse, incluso si vive en un iframe externo.
export const claimPlayback = stop => {
  if (activeStop && activeStop !== stop) activeStop()
  activeStop = stop
  return () => { if (activeStop === stop) activeStop = null }
}
