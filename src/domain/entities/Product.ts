export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  sku: string;
  categoryName: string;
  images: string[];
  
  // Atributos opcionales (Solo se muestran si el producto los tiene)
  maxAmperage?: string | null;      // Ej: "500 AMP"
  workCycle?: string | null;        // Ej: "500A - 60%"[cite: 8]
  powerSupply?: string | null;      // Ej: "Trifásica"[cite: 8]
  weldingProcess?: string | null;   // Ej: "MIG/MAG / MMA"[cite: 8]
  presentation?: string | null;     // Ej: "Rollo de 15 Kg" (Para alambres)
  dimensions?: string | null;       // Ej: "115x99 mm" (Para accesorios/lentes)
  
  isFeatured: boolean;
}