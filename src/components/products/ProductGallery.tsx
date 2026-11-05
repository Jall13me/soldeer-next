'use client'

import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '/uploads/default-machine.jpg');
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Imagen Principal con Zoom Interactivo */}
      <div
        className="relative w-full h-[420px] bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-sm cursor-zoom-in flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={selectedImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-100 ease-out"
          style={{
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
            transform: isHovered ? 'scale(2.2)' : 'scale(1)',
          }}
        />
        {!isHovered && (
          <span className="absolute bottom-3 right-3 bg-slate-900/70 backdrop-blur text-white text-[10px] px-2.5 py-1 rounded-md font-medium">
            🔍 Pasa el cursor para hacer zoom
          </span>
        )}
      </div>

      {/* Miniaturas de la Galería */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`h-24 bg-slate-100 border rounded-xl overflow-hidden transition ${selectedImage === img ? 'border-[#0d9488] ring-2 ring-[#0d9488]/30 shadow-sm' : 'border-slate-200 hover:border-slate-400'}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}