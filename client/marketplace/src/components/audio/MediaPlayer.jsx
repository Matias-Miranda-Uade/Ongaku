import { getMediaSource } from './mediaSource'
import AudioPlayer from './AudioPlayer'
export default function MediaPlayer({ url, durationSeconds, id, onPlaybackChange }) {
  if (!getMediaSource(url)) return <p role="alert">Este enlace no es compatible. Usá un archivo de audio o un enlace de Spotify, Apple Music o YouTube.</p>
  return <AudioPlayer onPlaybackChange={onPlaybackChange} preview={{ id, url, durationSeconds }} />
}
