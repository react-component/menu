import type { MenuMode } from '../interface';

export function genMultiMode(
  keys: string[],
  mode?: MenuMode,
  inlineMaxLevel?: number,
): {
  isMulti: boolean;
  isPopup: boolean;
  isMultiPopup: boolean;
} {
  const multi = {
    isMulti: false,
    isPopup: false,
    isMultiPopup: false,
  };

  if (mode === 'inline' && typeof inlineMaxLevel === 'number') {
    multi.isMulti = true;
  }

  if (keys?.length >= inlineMaxLevel) {
    multi.isPopup = true;
  }

  if (multi.isMulti && multi.isPopup) {
    multi.isMultiPopup = true;
  }

  return multi;
}
