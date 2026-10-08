const AudioWaveform = () => (
  <div className="waveform" aria-hidden="true">
    {Array.from({ length: 28 }, (_, i) => <span key={i} style={{ height: `${20 + ((i * 17) % 65)}%` }} />)}
  </div>
)
export default AudioWaveform
