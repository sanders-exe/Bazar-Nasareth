import test from 'node:test';
import assert from 'node:assert/strict';
import { coverImages } from '../src/modules/contenido/coverImages.js';

test('La portada recupera cada original por separado y conserva las fotos asignadas', () => {
  const alt = (id) => `Foto ${id}`;
  const sources = (cover) => coverImages(cover, alt).map((photo) => photo.src);
  assert.deepEqual(sources(null), ['/images/vasos-personalizados.jpeg', '/images/regalo-padrinos.jpeg']);
  assert.deepEqual(sources({ imagenId: 7 }), ['/api/imagenes/7/archivo', '/images/regalo-padrinos.jpeg']);
  assert.deepEqual(sources({ imagen2Id: 8 }), ['/images/vasos-personalizados.jpeg', '/api/imagenes/8/archivo']);
  assert.deepEqual(coverImages({ imagenId: 7, imagen2Id: 8 }, alt), [
    { src: '/api/imagenes/7/archivo', alt: 'Foto 7' },
    { src: '/api/imagenes/8/archivo', alt: 'Foto 8' },
  ]);
});
