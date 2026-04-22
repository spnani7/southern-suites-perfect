'use client';
import { useState } from 'react';
import { Hotel } from '@/lib/hotels-data';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

export default function HotelGallery({ hotel, liveImages }: { hotel: Hotel; liveImages?: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = (liveImages && liveImages.length > 0) ? liveImages : hotel.images?.length > 0 ? hotel.images : [];
  const hasImages = images.length > 0;

  return (
    <>
      <div className="grid grid-cols-4 gap-1 h-72 md:h-96 bg-brand-black">
        {/* Main image */}
        <div
          className="col-span-2 row-span-2 cursor-pointer relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-rich to-brand-black"
          onClick={() => setLightbox(0)}
        >
          {hasImages ? (
            <img src={images[0]} alt={hotel.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-gold/20 font-serif text-6xl">{hotel.shortName[0]}</div>
              <div className="text-[9px] text-white/20 font-sans">No photos yet</div>
            </div>
          )}
          <div className="absolute bottom-3 left-3 text-[9px] text-white/40 font-sans tracking-widest uppercase">Main Photo</div>
          <div className="absolute top-3 left-3 text-[9px] bg-gold text-brand-black px-2 py-1 font-sans tracking-wider uppercase">{hotel.badge}</div>
        </div>

        {/* Side images */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="cursor-pointer relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-black to-brand-rich"
            onClick={() => hasImages ? setLightbox(i % images.length) : null}
          >
            {hasImages && images[i] ? (
              <img src={images[i]} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={16} className="text-gold/10" />
            )}
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-brand-black/70 flex items-center justify-center">
                <span className="text-white font-serif text-lg">+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && hasImages && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X size={24} />
          </button>
          <button onClick={() => setLightbox((lightbox - 1 + images.length) % images.length)} className="absolute left-4 text-white/60 hover:text-white">
            <ChevronLeft size={32} />
          </button>
          <img src={images[lightbox]} alt="" className="max-w-3xl max-h-[80vh] object-contain" />
          <button onClick={() => setLightbox((lightbox + 1) % images.length)} className="absolute right-4 text-white/60 hover:text-white">
            <ChevronRight size={32} />
          </button>
          <div className="absolute bottom-4 text-white/40 text-xs font-sans">
            {lightbox + 1} / {images.length} — {hotel.name}
          </div>
        </div>
      )}
    </>
  );
}
