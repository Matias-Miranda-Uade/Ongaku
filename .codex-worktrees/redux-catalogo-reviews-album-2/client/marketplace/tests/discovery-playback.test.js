import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chooseRandomAlbum } from '../src/components/home/chooseRandomAlbum.js';
import { startPlayback, releasePlayback } from '../src/components/audio/playback.js';

test('el descubrimiento elige sólo álbumes con preview y evita repetir el anterior', () => {
  const albums = [
    { id: 1, audioPreviewId: 20 },
    { id: 2, audioPreviewId: 21 },
    { id: 3, albumUrl: 'https://example.com/album' }
  ];
  assert.equal(chooseRandomAlbum(albums, '1').id, 2);
  assert.equal(chooseRandomAlbum(albums, 2).id, 1);
  assert.equal(albums.length, 3);
});

test('sin previews no inventa recomendaciones y permite el único álbum disponible', () => {
  assert.equal(chooseRandomAlbum([]), null);
  assert.equal(chooseRandomAlbum([{ id: 1 }]), null);
  const album = { id: 7, audioPreviewId: 1 };
  assert.equal(chooseRandomAlbum([album], 7), album);
});

test('activar otra preview detiene la anterior y una limpieza antigua no pierde la nueva', () => {
  let audioStops = 0;
  let embedStops = 0;
  const stopAudio = () => { audioStops += 1; };
  const stopEmbed = () => { embedStops += 1; };
  startPlayback(stopAudio);
  startPlayback(stopAudio);
  assert.equal(audioStops, 0);
  startPlayback(stopEmbed);
  assert.equal(audioStops, 1);
  releasePlayback(stopAudio);
  startPlayback(stopAudio);
  assert.equal(embedStops, 1);
  releasePlayback(stopAudio);
  startPlayback(stopEmbed);
  assert.equal(audioStops, 1);
  releasePlayback(stopEmbed);
});
