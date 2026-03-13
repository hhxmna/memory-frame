import React from 'react';
import { MediaSlot } from './MediaSlot';
import type { SlotConfig } from './slots';
import { PARTNER_BOARD_SIZE, partnerSlotsNew, partnerDecorations } from './partner-slots';

type PartnerFrameBoardProps = {
  debug?: boolean;
};

export function PartnerFrameBoard({ debug }: PartnerFrameBoardProps) {
  const [images, setImages] = React.useState<Record<string, string>>({});

  const handleUpload = React.useCallback((id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => {
      if (prev[id]) URL.revokeObjectURL(prev[id]);
      return { ...prev, [id]: url };
    });
  }, []);

  const { width, height } = PARTNER_BOARD_SIZE;

  return (
    <div
      className="partner-frame-board"
      data-debug={debug ? 'true' : 'false'}
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: 'transparent',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      {partnerDecorations.map((dec) => (
        <img
          key={dec.id}
          src={dec.src}
          alt=""
          className="partner-decoration"
          style={{
            position: 'absolute',
            left: dec.x,
            top: dec.y,
            width: dec.width,
            height: dec.height,
            pointerEvents: 'none',
            transform: dec.rotation ? `rotate(${dec.rotation}deg)` : undefined,
            transformOrigin: 'top left',
          }}
        />
      ))}

      {partnerSlotsNew.map((slot: SlotConfig) => (
        <MediaSlot
          key={slot.id}
          {...slot}
          imageSrc={images[slot.id]}
          onUpload={(file) => handleUpload(slot.id, file)}
        />
      ))}
    </div>
  );
}

