export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  /** URL de embed de Google Maps (coordenadas exactas). */
  mapSrc: string;
}

export const BRANCHES: readonly Branch[] = [
  {
    id: 'central',
    name: 'Sucursal Central',
    address: 'Av. Beni / Zona Norte, Santa Cruz de la Sierra',
    phone: '77671472',
    mapSrc: 'https://maps.google.com/maps?q=-17.7598701,-63.1727335&z=17&output=embed',
  },
  {
    id: 'altosanpedro',
    name: 'Sucursal Alto San Pedro',
    address: 'Zona Alto San Pedro, Santa Cruz de la Sierra',
    phone: '77671472',
    mapSrc: 'https://maps.google.com/maps?q=-17.814023,-63.1863773&z=17&output=embed',
  },
  {
    id: 'cochabamba',
    name: 'Sucursal Cochabamba',
    address: 'Cochabamba, Bolivia',
    phone: '77671472',
    mapSrc: 'https://maps.google.com/maps?q=-17.392182,-66.2012549&z=17&output=embed',
  },
];

export const PRIMARY_BRANCH: Branch = BRANCHES[0];
