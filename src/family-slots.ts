import type { SlotConfig } from './slots';

const FAMILY_BOARD_WIDTH = 318;
const FAMILY_BOARD_HEIGHT = 415;

// Polaroid: scaled up ~15%.
const POLAROID_X = 24;
const POLAROID_Y = 25;
const POLAROID_WIDTH = Math.round(110 * 1.15);
const POLAROID_HEIGHT = Math.round(120 * 1.15);
const POLAROID_INSET = 8;
const POLAROID_INSET_BOTTOM = 26;
const POLAROID_INNER_W = Math.round((110 - POLAROID_INSET * 2 - 3) * 1.15);
const POLAROID_INNER_H = Math.round((120 - POLAROID_INSET - POLAROID_INSET_BOTTOM + 6) * 1.15);

// Photo strip: artwork scaled up ~30%, slots slightly smaller for nicer borders.
const STRIP_X = 232 - Math.round(318 * 0.05);
const STRIP_Y = 155 - Math.round(415 * 0.06) - Math.round(415 * 0.10);
const STRIP_WIDTH = Math.round(70 * 1.3);
const STRIP_HEIGHT = Math.round(240 * 1.3);
const STRIP_INSET = 6;
const STRIP_SLOT_SCALE = 1.25;
const STRIP_SLOT_W = Math.round((70 - STRIP_INSET * 2 - 6) * STRIP_SLOT_SCALE);
const STRIP_SLOT_H = Math.round(53 * STRIP_SLOT_SCALE);
const STRIP_STEP = Math.round(56 * STRIP_SLOT_SCALE);
const stripSlotY = (i: number) => STRIP_Y + STRIP_INSET + i * STRIP_STEP - 2 + 3;

export const FAMILY_BOARD_SIZE = { width: FAMILY_BOARD_WIDTH, height: FAMILY_BOARD_HEIGHT };

/** Upload slots for the family frame: 4 photo-strip windows + 1 polaroid inner. */
export const familySlots: SlotConfig[] = [
  { id: 'photoStrip0', x: STRIP_X + STRIP_INSET + 5, y: stripSlotY(0) - 1, width: STRIP_SLOT_W + 2, height: STRIP_SLOT_H + 1, shape: 'rect' },
  { id: 'photoStrip1', x: STRIP_X + STRIP_INSET + 6, y: stripSlotY(1) + 2, width: STRIP_SLOT_W + 1, height: STRIP_SLOT_H + 2, shape: 'rect' },
  { id: 'photoStrip2', x: STRIP_X + STRIP_INSET + 6, y: stripSlotY(2) + 6, width: STRIP_SLOT_W + 2, height: STRIP_SLOT_H + 1, shape: 'rect' },
  { id: 'photoStrip3', x: STRIP_X + STRIP_INSET + 5, y: stripSlotY(3) + 9, width: STRIP_SLOT_W + 3, height: STRIP_SLOT_H + 2, shape: 'rect' },
  { id: 'polaroid', x: POLAROID_X + POLAROID_INSET + 1, y: POLAROID_Y + POLAROID_INSET - 2, width: POLAROID_INNER_W, height: POLAROID_INNER_H, shape: 'rect' },
];

/** Decorative SVG layers for the family frame (318×415). Order = paint order (first = back). */
export const familyDecorations: { id: string; src: string; x: number; y: number; width: number; height: number; rotation?: number }[] = [
  { id: 'polaroid', src: '/assets/family/polaroid-3.svg', x: POLAROID_X, y: POLAROID_Y, width: POLAROID_WIDTH, height: POLAROID_HEIGHT },
  { id: 'coffee', src: '/assets/family/coffee.svg', x: 155, y: 50, width: 60, height: 60 },
  { id: 'dices', src: '/assets/family/dices.svg', x: 220, y: 20, width: 70, height: 60 },
  { id: 'matches', src: '/assets/family/matches-2.svg', x: 170, y: 130, width: 46, height: 96 },
  { id: 'tickets', src: '/assets/family/tickets.svg', x: 2, y: 180, width: 130, height: 120 },
  { id: 'flower', src: '/assets/family/flower.svg', x: 95, y: 150, width: 90, height: 170 },
  { id: 'note', src: '/assets/family/family-note.svg', x: 2, y: 310, width: Math.round(190 * 0.95), height: Math.round(90 * 0.95) },
  { id: 'star', src: '/assets/family/star.svg', x: 155, y: 280, width: 70, height: 70 },
  { id: 'photoStrip', src: '/assets/family/photostrip-3.svg', x: STRIP_X, y: STRIP_Y, width: STRIP_WIDTH, height: STRIP_HEIGHT },
];

