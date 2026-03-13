import React from 'react';
import { MediaSlot } from './MediaSlot';
import type { SlotConfig } from './slots';
import { friendSlots, friendDecorations, FRIEND_BOARD_SIZE } from './friend-slots';

type FriendFrameBoardProps = {
  debug?: boolean;
};

export function FriendFrameBoard({ debug }: FriendFrameBoardProps) {
  const [images, setImages] = React.useState<Record<string, string>>({});

  const handleUpload = React.useCallback((id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setImages((prev) => {
      if (prev[id]) URL.revokeObjectURL(prev[id]);
      return { ...prev, [id]: url };
    });
  }, []);

  const { width, height } = FRIEND_BOARD_SIZE;

  return (
    <div
      className="friend-frame-board"
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
      {/* Decorative SVG layers (back to front) */}
      {friendDecorations.map((dec) => (
        <img
          key={dec.id}
          src={dec.src}
          alt=""
          className="friend-decoration"
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

      {/* Upload slots (precise over the empty areas of photo strip and polaroid) */}
      {friendSlots.map((slot: SlotConfig) => (
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
