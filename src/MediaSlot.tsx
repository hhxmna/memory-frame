import React from 'react';
import type { SlotConfig } from './slots';

const UPLOAD_PLACEHOLDER_SRC = '/assets/upload-placeholder.svg';

type MediaSlotProps = SlotConfig & {
  imageSrc?: string;
  onUpload(file: File): void;
};

export function MediaSlot({ x, y, width, height, rotation = 0, shape = 'rect', imageSrc, onUpload }: MediaSlotProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = '';
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'));
    if (file) onUpload(file);
  };

  return (
    <>
      <div
        className={`media-slot media-slot--${shape}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
          overflow: 'hidden',
          transform: rotation ? `rotate(${rotation}deg)` : 'none',
          transformOrigin: 'top left',
        }}
        onClick={handleClick}
        onDragOver={e => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={handleDrop}
      >
        <div className={`slot-mask${shape === 'heart' ? ' slot-mask--heart' : ''}`}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              className="slot-image"
            />
          ) : (
            <img
              src={UPLOAD_PLACEHOLDER_SRC}
              alt="Upload photo"
              className="slot-image slot-placeholder"
            />
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </>
  );
}
