import { imageUrl } from '../../shared/images.js';

export const coverImageFields = [
  {
    name: 'imagenId',
    label: 'Imagen 1',
    original: '/images/vasos-personalizados.jpeg',
    alt: 'Vasos de vidrio personalizados con iniciales doradas, preparados en una caja de regalo',
  },
  {
    name: 'imagen2Id',
    label: 'Imagen 2',
    original: '/images/regalo-padrinos.jpeg',
    alt: 'Caja de regalo con vasos personalizados para padrinos de boda',
  },
];

export function coverImages(cover, imageAlt) {
  return coverImageFields.map(({ name, original, alt }) => {
    const id = cover?.[name];
    return id ? { src: imageUrl(id), alt: imageAlt(id) || '' } : { src: original, alt };
  });
}
