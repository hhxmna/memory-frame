import React from 'react';
import { MediaSlot } from './MediaSlot';
import type { SlotConfig } from './slots';
import { familySlots, familyDecorations, FAMILY_BOARD_SIZE } from './family-slots';

type FamilyFrameBoardProps = {
  debug?: boolean;
};

export function FamilyFrameBoard({ debug }: FamilyFrameBoardProps) {
  const [images, setImages] = React.useState<Record<string, string>>({});

  const handleUpload = React.useCallback((id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => {
      if (prev[id]) URL.revokeObjectURL(prev[id]);
      return { ...prev, [id]: url };
    });
  }, []);

  const { width, height } = FAMILY_BOARD_SIZE;

  return (
    <div
      className="family-frame-board"
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
      {familyDecorations.map((dec) => (
        <img
          key={dec.id}
          src={dec.src}
          alt=""
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

      {familySlots.map((slot: SlotConfig) => (
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

