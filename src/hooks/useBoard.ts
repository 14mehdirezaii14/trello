'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Board, Card, Comment, List } from '@/types/board';
import { loadBoard, saveBoard } from '@/services/storage';
import { createInitialBoard } from '@/data/initialBoard';
import { generateId } from '@/utils/id';

export function useBoard() {
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    const loaded = loadBoard();
    setBoard(loaded ?? createInitialBoard());
  }, []);

  useEffect(() => {
    if (board) saveBoard(board);
  }, [board]);

  const updateBoardTitle = useCallback((title: string) => {
    setBoard((prev) => (prev ? { ...prev, title } : null));
  }, []);

  const addList = useCallback((title: string) => {
    if (!board) return;
    const newList: List = {
      id: generateId(),
      boardId: board.id,
      title: title || 'New List',
      order: board.lists.length,
      cards: [],
    };
    setBoard({
      ...board,
      lists: [...board.lists, newList],
    });
  }, [board]);

  const updateList = useCallback((listId: string, updates: Partial<Pick<List, 'title'>>) => {
    if (!board) return;
    setBoard({
      ...board,
      lists: board.lists.map((l) =>
        l.id === listId ? { ...l, ...updates } : l
      ),
    });
  }, [board]);

  const deleteList = useCallback((listId: string) => {
    if (!board) return;
    setBoard({
      ...board,
      lists: board.lists.filter((l) => l.id !== listId),
    });
  }, [board]);

  const deleteAllCardsInList = useCallback((listId: string) => {
    if (!board) return;
    setBoard({
      ...board,
      lists: board.lists.map((l) =>
        l.id === listId ? { ...l, cards: [] } : l
      ),
    });
  }, [board]);

  const reorderLists = useCallback((listIds: string[]) => {
    if (!board) return;
    const orderMap = new Map(listIds.map((id, i) => [id, i]));
    const sorted = [...board.lists].sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
    setBoard({ ...board, lists: sorted });
  }, [board]);

  const addCard = useCallback((listId: string, title: string) => {
    if (!board) return;
    const list = board.lists.find((l) => l.id === listId);
    if (!list) return;
    const newCard: Card = {
      id: generateId(),
      listId,
      title: title || 'New Card',
      comments: [],
      order: list.cards.length,
    };
    setBoard({
      ...board,
      lists: board.lists.map((l) =>
        l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l
      ),
    });
  }, [board]);

  const updateCard = useCallback((cardId: string, updates: Partial<Pick<Card, 'title'>>) => {
    if (!board) return;
    setBoard({
      ...board,
      lists: board.lists.map((list) => ({
        ...list,
        cards: list.cards.map((c) =>
          c.id === cardId ? { ...c, ...updates } : c
        ),
      })),
    });
  }, [board]);

  const deleteCard = useCallback((cardId: string) => {
    if (!board) return;
    setBoard({
      ...board,
      lists: board.lists.map((list) => ({
        ...list,
        cards: list.cards.filter((c) => c.id !== cardId),
      })),
    });
  }, [board]);

  const moveCard = useCallback((cardId: string, targetListId: string, targetIndex: number) => {
    if (!board) return;
    let card: Card | null = null;
    const listsWithoutCard = board.lists.map((list) => {
      const idx = list.cards.findIndex((c) => c.id === cardId);
      if (idx !== -1) {
        [card] = list.cards.splice(idx, 1);
        return { ...list, cards: [...list.cards] };
      }
      return list;
    });
    if (!card) return;
    // TS doesn't narrow `card` after the guard because it was assigned inside a .map() callback,
    // so it still types as Card | null and { ...card } triggers "Spread types may only be created from object types".
    // Assigning to a variable with explicit type Card fixes the spread.
    const cardToMove: Card = card;
    const updatedCard = { ...cardToMove, listId: targetListId };
    const listsWithCard = listsWithoutCard.map((list) => {
      if (list.id !== targetListId) return list;
      const cards = [...list.cards];
      cards.splice(Math.min(targetIndex, cards.length), 0, updatedCard);
      return { ...list, cards: cards.map((c, i) => ({ ...c, order: i })) };
    });
    setBoard({ ...board, lists: listsWithCard });
  }, [board]);

  const reorderCardsInList = useCallback((listId: string, cardIds: string[]) => {
    if (!board) return;
    setBoard({
      ...board,
      lists: board.lists.map((list) => {
        if (list.id !== listId) return list;
        const orderMap = new Map(cardIds.map((id, i) => [id, i]));
        const sorted = [...list.cards].sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
        return { ...list, cards: sorted.map((c, i) => ({ ...c, order: i })) };
      }),
    });
  }, [board]);

  const addComment = useCallback((cardId: string, text: string) => {
    if (!board || !text.trim()) return;
    const newComment: Comment = {
      id: generateId(),
      cardId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setBoard({
      ...board,
      lists: board.lists.map((list) => ({
        ...list,
        cards: list.cards.map((c) =>
          c.id === cardId ? { ...c, comments: [...c.comments, newComment] } : c
        ),
      })),
    });
  }, [board]);

  const getCardById = useCallback((cardId: string): Card | null => {
    if (!board) return null;
    for (const list of board.lists) {
      const card = list.cards.find((c) => c.id === cardId);
      if (card) return card;
    }
    return null;
  }, [board]);

  return {
    board,
    updateBoardTitle,
    addList,
    updateList,
    deleteList,
    deleteAllCardsInList,
    reorderLists,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCardsInList,
    addComment,
    getCardById,
  };
}
