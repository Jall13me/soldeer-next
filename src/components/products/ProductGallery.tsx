'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/lib/product-specs';
import { cn } from '@/lib/cn';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

interface Point {
  x: number;
  y: number;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const gallery = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const [selected, setSelected] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState<Point | null>(null);
  const current = gallery[Math.min(selected, gallery.length - 1)];
  const canZoom = current !== PLACEHOLDER_IMAGE;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: ((event.clientX - left) / width) * 100,
      y: ((event.clientY - top) / height) * 100,
    });
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
          canZoom && 'cursor-zoom-in',
        )}
        onMouseMove={canZoom ? handleMouseMove : undefined}
        onMouseLeave={() => setZoomOrigin(null)}
      >
        <Image
          src={current}
          alt={title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          loading="eager"
          fetchPriority="high"
          className="object-contain p-3 transition-transform duration-100 ease-out"
          style={{
            transformOrigin: zoomOrigin ? `${zoomOrigin.x}% ${zoomOrigin.y}%` : 'center',
            transform: zoomOrigin ? 'scale(2.2)' : 'scale(1)',
          }}
        />
        {canZoom && !zoomOrigin && (
          <span className="pointer-events-none absolute bottom-3 right-3 hidden rounded-md bg-slate-900/70 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur md:block">
            🔍 Pasa el cursor para hacer zoom
          </span>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Ver imagen ${index + 1} de ${gallery.length}`}
              aria-pressed={src === current}
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-xl border bg-white transition',
                src === current ? 'border-brand shadow-sm ring-2 ring-brand/30' : 'border-slate-200 hover:border-slate-400',
              )}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
