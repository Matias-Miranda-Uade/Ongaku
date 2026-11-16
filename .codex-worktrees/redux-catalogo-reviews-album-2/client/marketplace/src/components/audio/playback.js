// Sólo un reproductor puede conservar la reproducción activa.
let stopCurrent = null;

export function startPlayback(stop) {
  if (stopCurrent && stopCurrent !== stop) stopCurrent();
  stopCurrent = stop;
}

export function releasePlayback(stop) {
  if (stopCurrent === stop) stopCurrent = null;
}
