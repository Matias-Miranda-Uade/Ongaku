import { useId, useState } from 'react'

const VinylCover = ({ src, alt, className }) => {
  const clipId = `record-${useId().replace(/:/g, '')}`
  const [failedSrc, setFailedSrc] = useState(null)
  if (!src || failedSrc === src) return (
    <svg className={className} viewBox="0 0 600 600" role="img" aria-label={`${alt}: portada no disponible`}>
      <rect width="600" height="600" fill="#29292b" />
      <circle cx="300" cy="270" r="185" fill="#141416" stroke="#777" strokeWidth="2" />
      {[155, 130, 105].map((radius) => <circle key={radius} cx="300" cy="270" r={radius} fill="none" stroke="#505054" />)}
      <circle cx="300" cy="270" r="55" fill="#f2a7af" /><circle cx="300" cy="270" r="9" fill="#141416" />
      <text x="300" y="520" textAnchor="middle" fill="#eee" fontFamily="Arial, sans-serif" fontSize="24">Portada no disponible</text>
    </svg>
  )
  if (!src.startsWith('/covers/') || !src.endsWith('.svg')) return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />

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
