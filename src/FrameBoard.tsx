import React from 'react';
import { MediaSlot } from './MediaSlot';
import type { SlotConfig } from './slots';

type FrameBoardProps = {
  frameImage: string;
  slots: SlotConfig[];
  debug?: boolean;
};

export function FrameBoard({ frameImage, slots, debug }: FrameBoardProps) {
  const [images, setImages] = React.useState<Record<string, string>>({});

  const handleUpload = React.useCallback((id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setImages(prev => {
      if (prev[id]) URL.revokeObjectURL(prev[id]);
      return { ...prev, [id]: url };
    });
  }, []);

  return (
    <div
      className="frame-board"
      data-debug={debug ? 'true' : 'false'}
      style={{ position: 'relative', width: 318, height: 415 }}
    >
      <img src={frameImage} alt="" className="frame-board-art" />
      {slots.map(slot => (
        <MediaSlot
          key={slot.id}
          {...slot}
          imageSrc={images[slot.id]}
          onUpload={file => handleUpload(slot.id, file)}
        />
      ))}
    </div>
  );
}
