import { coverImageFields } from './coverImages.js';

const sectionFields = [
  ['clave', 'Clave única (portada, presentación, preguntas...)', 'text'],
  ['titulo', 'Título', 'text'],
  ['cuerpo', 'Descripción visible', 'textarea'],
  ['imagenId', 'Fotografía', 'image'],
  ['orden', 'Orden', 'number'],
  ['estado', 'Estado', 'status'],
];

export const contenidoConfig = {
  fields: {
    secciones: sectionFields,
    portada: [
      ...sectionFields.slice(0, 3),
      ...coverImageFields.map(({ name, label }) => [name, label, 'image']),
      ...sectionFields.slice(4),
    ],
  },
  defaults: {
    secciones: {
      clave: '',
      titulo: '',
      cuerpo: '',
      imagenId: null,
      orden: 0,
      estado: 'Borrador',
    },
  },
};
