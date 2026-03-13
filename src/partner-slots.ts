import type { SlotConfig } from './slots';

const PARTNER_BOARD_WIDTH = 318;
const PARTNER_BOARD_HEIGHT = 415;

// Photo strip: scaled up ~30%.
const STRIP_X = 32;
const STRIP_Y = 23;
const STRIP_WIDTH = Math.round(54 * 1.3);
const STRIP_HEIGHT = Math.round(220 * 1.3);
const STRIP_INSET = 5;
const STRIP_SLOT_W = Math.round((54 - STRIP_INSET * 2 + 2) * 1.3 * 1.01 * 1.02);
const STRIP_SLOT_H = Math.round(48 * 1.3);
const STRIP_STEP = Math.round(54 * 1.3);
const stripSlotY = (i: number) => STRIP_Y + STRIP_INSET + i * STRIP_STEP - 5;

// Polaroid: scaled up ~15%.
const POLAROID_X = 128;
const POLAROID_Y = 274;
const POLAROID_WIDTH = Math.round(88 * 1.15);
const POLAROID_HEIGHT = Math.round(104 * 1.15);
const POLAROID_INSET = 6;
const POLAROID_INSET_BOTTOM = 18;
const POLAROID_INNER_W = Math.round((88 - POLAROID_INSET * 2) * 1.15);
const POLAROID_INNER_H = Math.round((104 - POLAROID_INSET - POLAROID_INSET_BOTTOM) * 1.15);

export const PARTNER_BOARD_SIZE = { width: PARTNER_BOARD_WIDTH, height: PARTNER_BOARD_HEIGHT };

/** Upload slots for the partner frame: 4 photo-strip windows + 1 polaroid inner. */
export const partnerSlotsNew: SlotConfig[] = [
  { id: 'photoStrip0', x: STRIP_X + STRIP_INSET - 2, y: stripSlotY(0) + 4 + Math.round(415 * 0.01) - Math.round(415 * 0.02) + Math.round(415 * 0.01), width: STRIP_SLOT_W, height: Math.round(STRIP_SLOT_H * 1.02), shape: 'rect' },
  { id: 'photoStrip1', x: STRIP_X + STRIP_INSET - 2, y: stripSlotY(1) + 2, width: STRIP_SLOT_W, height: STRIP_SLOT_H, shape: 'rect' },
  { id: 'photoStrip2', x: STRIP_X + STRIP_INSET - 2, y: stripSlotY(2), width: STRIP_SLOT_W, height: STRIP_SLOT_H, shape: 'rect' },
  { id: 'photoStrip3', x: STRIP_X + STRIP_INSET - 2, y: stripSlotY(3) - 3, width: STRIP_SLOT_W, height: STRIP_SLOT_H, shape: 'rect' },
  { id: 'polaroid', x: POLAROID_X + POLAROID_INSET - 1, y: POLAROID_Y + POLAROID_INSET, width: POLAROID_INNER_W + 3, height: POLAROID_INNER_H + 1, shape: 'rect' },
];

/** Decorative SVG layers for the partner frame (318×415). Order = paint order (first = back). */
export const partnerDecorations: { id: string; src: string; x: number; y: number; width: number; height: number; rotation?: number }[] = [
  { id: 'photostrip', src: '/assets/partner/photostrip.svg', x: STRIP_X, y: STRIP_Y, width: STRIP_WIDTH, height: STRIP_HEIGHT },
  { id: 'bow', src: '/assets/partner/bow.svg', x: 103, y: 30, width: 90, height: 60 },
  { id: 'license', src: '/assets/partner/license-2.svg', x: 208, y: 28, width: 90, height: 52 },
  { id: 'key', src: '/assets/partner/key.svg', x: 252, y: 112, width: 40, height: 80 },
  { id: 'mail', src: '/assets/partner/mail.svg', x: 32, y: 330, width: 80, height: 60 },
  { id: 'matches', src: '/assets/partner/matches.svg', x: 220, y: 199, width: 82, height: 64 },
  { id: 'note', src: '/assets/partner/note-2.svg', x: 110, y: 200, width: Math.round(98 * 0.95), height: Math.round(72 * 0.95), rotation: -10 },
  { id: 'card', src: '/assets/partner/card.svg', x: 160, y: 90, width: 68, height: 90 },
  { id: 'polaroid', src: '/assets/partner/polaroid-2.svg', x: POLAROID_X, y: POLAROID_Y, width: POLAROID_WIDTH, height: POLAROID_HEIGHT },
  { id: 'lighter', src: '/assets/partner/lighter.svg', x: 236, y: 288, width: 70, height: 108 },
];

