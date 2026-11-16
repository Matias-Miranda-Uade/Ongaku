import assert from 'node:assert/strict'
import { test } from 'node:test'
import { claimPlayback } from '../src/components/audio/playback.js'

test('audio e iframe comparten un único turno de reproducción', () => {
  const stopped = []
  const releaseAudio = claimPlayback(() => stopped.push('audio'))
  const releaseEmbed = claimPlayback(() => stopped.push('iframe'))
  assert.deepEqual(stopped, ['audio'])
  // Desmontar el reproductor anterior no libera al que lo reemplazó.
  releaseAudio()
  const releaseNext = claimPlayback(() => stopped.push('next'))
  assert.deepEqual(stopped, ['audio', 'iframe'])
  releaseEmbed()
  releaseNext()
  const releaseLast = claimPlayback(() => stopped.push('last'))
  assert.deepEqual(stopped, ['audio', 'iframe'])
  releaseLast()
})
