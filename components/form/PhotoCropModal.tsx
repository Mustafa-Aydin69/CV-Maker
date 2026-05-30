// components/form/PhotoCropModal.tsx — Tarayıcı içi fotoğraf kırpma
"use client";

import { useEffect, useRef, useState } from "react";

const CROP_DISPLAY = 240; // ekrandaki kırpma karesi (px)
const OUTPUT_SIZE  = 480; // kaydedilen görüntü boyutu (px)

interface Props {
  src: string;
  onApply: (dataUrl: string) => void;
  onClose: () => void;
}

export default function PhotoCropModal({ src, onApply, onClose }: Props) {
  const [zoom, setZoom]     = useState(1);
  const [ox, setOx]         = useState(0); // görüntü kaydırma x
  const [oy, setOy]         = useState(0); // görüntü kaydırma y
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const imgRef    = useRef<HTMLImageElement>(null);

  // Zoom değişince merkeze sıfırla
  useEffect(() => { setOx(0); setOy(0); }, [zoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox, oy };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setOx(dragStart.current.ox + e.clientX - dragStart.current.x);
    setOy(dragStart.current.oy + e.clientY - dragStart.current.y);
  };
  const onPointerUp = () => setDragging(false);

  const apply = () => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    const canvas = document.createElement("canvas");
    canvas.width  = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d")!;

    // Ekranda görüntü boyutu
    const dispW = img.naturalWidth  * zoom;
    const dispH = img.naturalHeight * zoom;
    // Görüntünün kırpma kutusuna göre sol-üst köşesi
    const imgLeft = (CROP_DISPLAY - dispW) / 2 + ox;
    const imgTop  = (CROP_DISPLAY - dispH) / 2 + oy;
    // Doğal görüntüdeki kaynak bölge
    const srcX = -imgLeft / zoom;
    const srcY = -imgTop  / zoom;
    const srcW = CROP_DISPLAY / zoom;
    const srcH = CROP_DISPLAY / zoom;

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    onApply(canvas.toDataURL("image/jpeg", 0.92));
  };

  return (
    <div className="crop-modal">
      <div className="crop-modal__backdrop" onClick={onClose} />
      <div className="crop-modal__box">
        <div className="crop-modal__hd">
          <span>Fotoğrafı Kırp</span>
          <button className="crop-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Kırpma alanı */}
        <div
          className="crop-modal__stage"
          style={{ width: CROP_DISPLAY, height: CROP_DISPLAY }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            className="crop-modal__img"
            style={{
              transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) scale(${zoom})`,
              cursor: dragging ? "grabbing" : "grab",
            }}
            draggable={false}
          />
          <div className="crop-modal__frame" />
        </div>

        {/* Zoom kaydırıcı */}
        <div className="crop-modal__zoom">
          <span>🔍</span>
          <input
            type="range" min={0.3} max={3} step={0.05}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
          <span>{Math.round(zoom * 100)}%</span>
        </div>
        <p className="crop-modal__hint">Sürükle veya kaydırarak konumlandır</p>

        <div className="crop-modal__ft">
          <button className="btn btn--ghost" onClick={onClose}>İptal</button>
          <button className="btn btn--primary" onClick={apply}>Uygula</button>
        </div>
      </div>
    </div>
  );
}
