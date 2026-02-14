/**
 * Domain types for Trello Clone
 */

export interface Comment {
  id: string;
  cardId: string;
  text: string;
  createdAt: string;
}

export interface Card {
  id: string;
  listId: string;
  title: string;
  comments: Comment[];
  order?: number;
}

export interface List {
  id: string;
  boardId: string;
  title: string;
  order: number;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
}

export const DEFAULT_BOARD_TITLE = 'Demo Board';

export const STORAGE_KEY = 'trello-clone-board';
