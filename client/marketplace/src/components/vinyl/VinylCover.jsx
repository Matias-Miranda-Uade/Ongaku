import { useId } from 'react'

const VinylCover = ({ src, alt, className }) => {
  const clipId = `record-${useId().replace(/:/g, '')}`
  if (!src?.startsWith('/covers/') || !src.endsWith('.svg')) return <img src={src} alt={alt} className={className} />

  return (
    <svg className={className} viewBox="0 0 600 600" role="img" aria-label={alt}>
      <defs><clipPath id={clipId}><circle cx="300" cy="275" r="170" /></clipPath></defs>
      <image href={src} width="600" height="600" />
      <g className="cover-disc">
        <g clipPath={`url(#${clipId})`}>
          <image href={src} width="600" height="600" />
          <path d="M160 180 L420 370" stroke="#ffffff" strokeWidth="24" opacity=".08" />
          <path d="M303 225 L317 228" stroke="#68624d" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  )
}

export default VinylCover
