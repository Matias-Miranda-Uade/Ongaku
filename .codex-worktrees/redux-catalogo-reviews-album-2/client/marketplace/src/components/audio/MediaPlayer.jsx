import { useEffect, useRef, useState } from 'react'
import { getMediaSource } from './mediaSource'
import AudioPlayer from './AudioPlayer'
import { startPlayback, releasePlayback } from './playback'

const MediaPlayer = ({ url, durationSeconds, id }) => {
  const source = getMediaSource(url)
  const [embedActive, setEmbedActive] = useState(false)
  const [embedError, setEmbedError] = useState(false)
  const stopRef = useRef(() => setEmbedActive(false))
  useEffect(() => {
    setEmbedActive(false)
    setEmbedError(false)
    const stop = stopRef.current
    return () => releasePlayback(stop)
  }, [url])
  if (!source) return <p role="alert">Este enlace no es compatible. Usá un archivo de audio o un enlace de Spotify, Apple Music o YouTube.</p>
  return <div className="media-player">
    {source.type === 'embed'
      ? embedActive ? <>
          <iframe key={source.embedUrl} src={source.embedUrl} title={`Escuchar en ${source.platform}`}
            width="100%" height={source.height} loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen onError={() => setEmbedError(true)} />
          {embedError && <p role="alert">No se pudo cargar el reproductor.</p>}
          <a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">Abrir en {source.platform} ↗</a>
          <button type="button" className="text-link link-button" onClick={() => {
            setEmbedActive(false)
            releasePlayback(stopRef.current)
          }}>Cerrar reproductor</button>
        </> : <button type="button" className="secondary-button" onClick={() => {
          startPlayback(stopRef.current)
          setEmbedError(false)
          setEmbedActive(true)
        }}>▶ Escuchar en {source.platform}</button>
      : <AudioPlayer preview={{ id: id ?? source.url, url: source.url, durationSeconds }} />}
    {source.type === 'audio' && <a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">Abrir audio ↗</a>}
  </div>
}
export default MediaPlayer
