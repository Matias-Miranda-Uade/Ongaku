import { useEffect, useRef, useState } from 'react';
import AudioProgress from './AudioProgress';
import AudioWaveform from './AudioWaveform';
import { claimPlayback } from './playback';
const AudioPlayer = ({
  preview,
  autoPlay = false
}) => {
  const audioRef = useRef(null);
  const releaseRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState('');
  const [duration, setDuration] = useState(Number(preview?.durationSeconds) || 0);
  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setError('');
    setDuration(Number(preview?.durationSeconds) || 0);
  }, [preview?.id, preview?.url]);
  useEffect(() => {
    const audio = audioRef.current;
    if (autoPlay && audio) {
      audio.play().catch(() => setError('No se pudo iniciar el audio. Presioná reproducir para escucharlo.'));
    }
    return () => {
      if (audio) audio.pause();
      releaseRef.current?.();
    };
  }, [autoPlay, preview?.id, preview?.url]);
  const toggle = () => {
    if (!preview?.url) return Promise.resolve();
    const audio = audioRef.current;
    if (!audio) return Promise.resolve();
    setError('');
    return Promise.resolve().then(() => {
      if (audio.paused) {
        return Promise.resolve(audio.play()).then(() => {});
      } else {
        audio.pause();
      }
    }).catch(() => {
      setPlaying(false);
      setError('No se pudo reproducir el audio.');
    });
  };
  return <div className="audio-player">
      {preview?.url && <audio ref={audioRef} src={preview.url} preload="metadata" onLoadedMetadata={event => {
      const seconds = event.currentTarget.duration;
      if (Number.isFinite(seconds)) setDuration(seconds);
    }} onPlay={event => {
      const current = event.currentTarget;
      releaseRef.current?.();
      releaseRef.current = claimPlayback(() => current.pause());
      document.querySelectorAll('audio').forEach(audio => {
        if (audio !== event.currentTarget) audio.pause();
      });
      setError('');
      setPlaying(true);
    }} onPause={() => setPlaying(false)} onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)} onEnded={() => setPlaying(false)} onError={() => {
      setPlaying(false);
      setError('No se pudo cargar el audio.');
    }} />}
      <button type="button" disabled={!preview?.url} aria-label={playing ? 'Pausar audio' : 'Reproducir audio'} onClick={toggle}>{playing ? 'Ⅱ' : '▶'}</button>
      <div className="audio-player-body">
        <AudioWaveform />
        <AudioProgress value={currentTime} duration={duration || 30} />
      </div>
      <span>{duration ? `${Math.ceil(duration)}s` : 'Audio'}</span>
      {error && <p role="alert">{error}</p>}
    </div>;
};
export default AudioPlayer;
