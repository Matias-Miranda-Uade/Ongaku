export function chooseRandomAlbum(vinyls, previousId) {
  const playable = vinyls.filter(vinyl => vinyl.audioPreviewId);
  const candidates = playable.length > 1
    ? playable.filter(vinyl => String(vinyl.id) !== String(previousId)) : playable;
  return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
}
