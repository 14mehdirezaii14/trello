/**
 * Initial board state (Demo Board)
 */

import type { Board } from '@/types/board';
import { DEFAULT_BOARD_TITLE } from '@/types/board';
import { generateId } from '@/utils/id';

export function createInitialBoard(): Board {
  const boardId = generateId();
  const list1Id = generateId();
  const list2Id = generateId();
  const list3Id = generateId();
  const card1Id = generateId();
  const card2Id = generateId();
  const card3Id = generateId();

  return {
    id: boardId,
    title: DEFAULT_BOARD_TITLE,
    lists: [
      {
        id: list1Id,
        boardId,
        title: 'To Do',
        order: 0,
        cards: [
          { id: card1Id, listId: list1Id, title: 'Task 1', comments: [], order: 0 },
          { id: card2Id, listId: list1Id, title: 'Task 2', comments: [], order: 1 },
        ],
      },
      {
        id: list2Id,
        boardId,
        title: 'In Progress',
        order: 1,
        cards: [
          { id: card3Id, listId: list2Id, title: 'Task 3', comments: [], order: 0 },
        ],
      },
      {
        id: list3Id,
        boardId,
        title: 'Done',
        order: 2,
        cards: [],
      },
    ],
  };
}
