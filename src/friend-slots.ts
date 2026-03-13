import type { SlotConfig } from './slots';

const FRIEND_BOARD_WIDTH = 318;
const FRIEND_BOARD_HEIGHT = 415;

// Photo strip: 54×219 at (12, 18). Four frames; use even step so lower boxes aren’t pushed too low.
const PHOTO_STRIP_X = 30;
const PHOTO_STRIP_Y = 18;
const INSET = 4;
const SLOT_W = Math.round((54 - INSET * 2 + 1) * 1.3);
const SLOT_H = Math.round(50 * 1.3);
// Tighter step so slots 2 and 3 align with the strip artwork.
const STRIP_STEP = Math.round(52 * 1.3);
const stripSlotY = (i: number) => PHOTO_STRIP_Y + INSET + i * STRIP_STEP - 2 + 1;

// Polaroid: scaled up ~15%.
const POLAROID_X = 168 - Math.round(318 * 0.03);
const POLAROID_Y = 185;
const POLAROID_INSET = 6;
const POLAROID_INSET_BOTTOM = 22;
const POLAROID_WIDTH = Math.round(89 * 1.15);
const POLAROID_HEIGHT = Math.round(109 * 1.15);
const POLAROID_INNER_W = Math.round((89 - POLAROID_INSET * 2 + 4) * 1.15);
const POLAROID_INNER_H = Math.round((109 - POLAROID_INSET - POLAROID_INSET_BOTTOM + 2) * 1.15);

export const FRIEND_BOARD_SIZE = { width: FRIEND_BOARD_WIDTH, height: FRIEND_BOARD_HEIGHT };

/** Upload slots for the friend frame: 4 photo-strip windows + 1 polaroid inner. */
export const friendSlots: SlotConfig[] = [
  { id: 'photoStrip0', x: PHOTO_STRIP_X + INSET - 1, y: stripSlotY(0), width: SLOT_W + 1, height: SLOT_H - 1, shape: 'rect' },
  { id: 'photoStrip1', x: PHOTO_STRIP_X + INSET - 1, y: stripSlotY(1), width: SLOT_W + 1, height: SLOT_H - 1, shape: 'rect' },
  { id: 'photoStrip2', x: PHOTO_STRIP_X + INSET - 1, y: stripSlotY(2), width: SLOT_W + 1, height: SLOT_H - 1, shape: 'rect' },
  { id: 'photoStrip3', x: PHOTO_STRIP_X + INSET - 1, y: stripSlotY(3), width: SLOT_W + 1, height: SLOT_H - 1, shape: 'rect' },
  { id: 'polaroid', x: POLAROID_X + POLAROID_INSET - 3, y: POLAROID_Y + POLAROID_INSET - 1, width: POLAROID_INNER_W, height: POLAROID_INNER_H, shape: 'rect' },
];

/** Decorative SVG layers for the friend frame (317×415). Order = paint order (first = back). */
export const friendDecorations: { id: string; src: string; x: number; y: number; width: number; height: number; rotation?: number }[] = [
  { id: 'photoStrip', src: '/assets/friend/Photo%20strip.svg', x: 30, y: 18, width: Math.round(54 * 1.3), height: Math.round(219 * 1.3) },
  { id: 'keychain', src: '/assets/friend/keychain.svg', x: 110, y: 38, width: 92, height: 119 },
  { id: 'ladybug', src: '/assets/friend/ladybug.svg', x: 260, y: 17, width: 50, height: 36 },
  { id: 'note', src: '/assets/friend/note.svg', x: 198, y: 35, width: Math.round(121 * 0.95), height: Math.round(123 * 0.95) },
  { id: 'favPerson', src: '/assets/friend/fav%20person%20sticket.svg', x: 235, y: 155, width: 67, height: 43 },
  { id: 'bear', src: '/assets/friend/bear.svg', x: 25, y: 310, width: Math.round(132 * 0.97 * 0.92 * 0.9), height: Math.round(120 * 0.97 * 0.92 * 0.9) },
  { id: 'polaroid', src: '/assets/friend/Polaroid.svg', x: POLAROID_X, y: POLAROID_Y, width: POLAROID_WIDTH, height: POLAROID_HEIGHT },
  { id: 'license', src: '/assets/friend/License.svg', x: 135, y: 320, width: 96, height: 54 },
  { id: 'postageHeart', src: '/assets/friend/Postage heart.svg', x: 240, y: 325, width: 64, height: 61 },
];
