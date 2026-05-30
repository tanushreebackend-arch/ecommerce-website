'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const ZOOM = 2.5;
const ZOOM_BOX_WIDTH = 400;

interface ProductImageZoomProps {
  src: string;
  alt: string;
  priority?: boolean;
  unoptimized?: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ProductImageZoom({ src, alt, priority, unoptimized }: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [canZoom, setCanZoom] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const sync = () => setCanZoom(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setDims({ w: width, h: height });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, src]);

  useEffect(() => {
    setHovering(false);
    setNatural({ w: 0, h: 0 });
  }, [src]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canZoom) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({
      x: clamp(e.clientX - rect.left, 0, rect.width),
      y: clamp(e.clientY - rect.top, 0, rect.height),
    });
  };

  const getCoverMapping = () => {
    const { w: W, h: H } = dims;
    const { w: nW, h: nH } = natural;
    if (!W || !H || !nW || !nH) return null;

    const imgAspect = nW / nH;
    const containerAspect = W / H;
    let renderedW: number;
    let renderedH: number;
    let offsetX: number;
    let offsetY: number;

    if (imgAspect > containerAspect) {
      renderedH = H;
      renderedW = H * imgAspect;
      offsetX = (W - renderedW) / 2;
      offsetY = 0;
    } else {
      renderedW = W;
      renderedH = W / imgAspect;
      offsetX = 0;
      offsetY = (H - renderedH) / 2;
    }

    const mx = clamp(cursor.x, offsetX, offsetX + renderedW);
    const my = clamp(cursor.y, offsetY, offsetY + renderedH);
    const imgX = ((mx - offsetX) / renderedW) * nW;
    const imgY = ((my - offsetY) / renderedH) * nH;

    return { W, H, nW, nH, imgX, imgY, offsetX, offsetY, renderedW, renderedH };
  };

  const mapping = getCoverMapping();

  const lens = mapping
    ? {
        w: ZOOM_BOX_WIDTH / ZOOM,
        h: mapping.H / ZOOM,
        left: clamp(mapping.imgX / mapping.nW * mapping.renderedW + mapping.offsetX - ZOOM_BOX_WIDTH / ZOOM / 2, mapping.offsetX, mapping.offsetX + mapping.renderedW - ZOOM_BOX_WIDTH / ZOOM),
        top: clamp(mapping.imgY / mapping.nH * mapping.renderedH + mapping.offsetY - mapping.H / ZOOM / 2, mapping.offsetY, mapping.offsetY + mapping.renderedH - mapping.H / ZOOM),
      }
    : null;

  const zoomStyle = mapping
    ? (() => {
        const bgW = mapping.nW * ZOOM;
        const bgH = mapping.nH * ZOOM;
        let bgX = ZOOM_BOX_WIDTH / 2 - mapping.imgX * ZOOM;
        let bgY = mapping.H / 2 - mapping.imgY * ZOOM;
        bgX = clamp(bgX, ZOOM_BOX_WIDTH - bgW, 0);
        bgY = clamp(bgY, mapping.H - bgH, 0);
        return {
          width: ZOOM_BOX_WIDTH,
          height: mapping.H,
          backgroundImage: `url(${src})`,
          backgroundSize: `${bgW}px ${bgH}px`,
          backgroundPosition: `${bgX}px ${bgY}px`,
          backgroundRepeat: 'no-repeat' as const,
        };
      })()
    : null;

  const showZoom = canZoom && hovering && mapping && zoomStyle;

  return (
    <div className="relative overflow-visible">
      <div
        ref={containerRef}
        className="relative aspect-square w-full image-luxury-wrap"
        onMouseEnter={() => canZoom && setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={handleMove}
        style={{ cursor: canZoom && hovering ? 'crosshair' : undefined }}
      >
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          className="object-cover product-main-image select-none"
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 560px"
          quality={100}
          unoptimized={unoptimized}
          draggable={false}
          onLoad={(e) => {
            const img = e.currentTarget;
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
            measure();
          }}
        />

        {showZoom && lens && (
          <>
            <div
              className="pointer-events-none absolute z-10"
              style={{
                left: lens.left,
                top: lens.top,
                width: lens.w,
                height: lens.h,
                border: '1px solid rgba(0,0,0,0.25)',
                backgroundColor: 'rgba(255,255,255,0.15)',
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute z-10 bg-black/20"
              style={{ left: cursor.x, top: 0, width: 1, height: dims.h }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute z-10 bg-black/20"
              style={{ left: 0, top: cursor.y, width: dims.w, height: 1 }}
              aria-hidden
            />
          </>
        )}
      </div>

      {showZoom && zoomStyle && (
        <div
          className="absolute left-full top-0 z-30 ml-3 hidden lg:block bg-white"
          style={{ ...zoomStyle, border: '1px solid #E8E8E8' }}
          aria-hidden
        />
      )}
    </div>
  );
}
