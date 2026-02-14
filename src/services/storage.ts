/**
 * localStorage persistence for board data
 */

import type { Board } from '@/types/board';
import { STORAGE_KEY } from '@/types/board';

export function loadBoard(): Board | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Board;
  } catch {
    return null;
  }
}

export function saveBoard(board: Board): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch {
    // ignore storage errors
  }
}
