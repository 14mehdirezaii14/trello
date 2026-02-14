'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import type { Board as BoardType } from '@/types/board';
import { BoardHeader } from '@/components/BoardHeader';
import { SortableListWrapper } from './SortableListWrapper';
import { CommentModal } from '@/components/CommentModal';

import styles from './Board.module.scss'

interface BoardProps {
  board: BoardType;
  onBoardTitleChange: (title: string) => void;
  onAddList: (title: string) => void;
  onListTitleChange: (listId: string, title: string) => void;
  onListDelete: (listId: string) => void;
  onReorderLists: (listIds: string[]) => void;
  onAddCard: (listId: string, title: string) => void;
  onCardTitleChange: (cardId: string, title: string) => void;
  onMoveCard: (cardId: string, targetListId: string, targetIndex: number) => void;
  onReorderCardsInList: (listId: string, cardIds: string[]) => void;
  onAddComment: (cardId: string, text: string) => void;
  getCardById: (cardId: string) => { id: string; listId: string; title: string; comments: { id: string; cardId: string; text: string; createdAt: string }[] } | null;
}

export function Board({
  board,
  onBoardTitleChange,
  onAddList,
  onListTitleChange,
  onListDelete,
  onReorderLists,
  onAddCard,
  onCardTitleChange,
  onMoveCard,
  onReorderCardsInList,
  onAddComment,
  getCardById,
}: BoardProps) {
  const [commentModalCardId, setCommentModalCardId] = useState<string | null>(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [showAddList, setShowAddList] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((_event: DragStartEvent) => {
    // optional: track drag state for UI
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current;
      const overId = String(over.id);

      if (activeData?.type === 'list') {
        const listIds = board.lists.map((l) => l.id);
        const oldIndex = listIds.indexOf(active.id as string);
        const newIndex = listIds.indexOf(overId);
        if (oldIndex === -1 || newIndex === -1) return;
        const reordered = [...listIds];
        const [removed] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, removed);
        onReorderLists(reordered);
        return;
      }

      if (activeData?.type === 'card') {
        const cardId = activeData.cardId as string;
        const sourceListId = activeData.listId as string;
        const sourceList = board.lists.find((l) => l.id === sourceListId);
        if (!sourceList) return;

        // overId can be a card id (same or other list) or "list-{listId}"
        if (overId.startsWith('list-')) {
          const targetListId = overId.replace('list-', '');
          const targetList = board.lists.find((l) => l.id === targetListId);
          if (!targetList) return;
          const targetIndex = targetList.cards.length;
          onMoveCard(cardId, targetListId, targetIndex);
          return;
        }

        // overId is a card id - find which list and index
        for (const list of board.lists) {
          const idx = list.cards.findIndex((c) => c.id === overId);
          if (idx !== -1) {
            const isSameList = list.id === sourceListId;
            if (isSameList) {
              const cardIds = list.cards.map((c) => c.id);
              const fromIdx = cardIds.indexOf(cardId);
              if (fromIdx === -1) return;
              const reordered = [...cardIds];
              reordered.splice(fromIdx, 1);
              reordered.splice(idx, 0, cardId);
              onReorderCardsInList(list.id, reordered);
            } else {
              onMoveCard(cardId, list.id, idx);
            }
            return;
          }
        }
      }
    },
    [
      board.lists,
      onReorderLists,
      onMoveCard,
      onReorderCardsInList,
    ]
  );

  const submitNewList = () => {
    const trimmed = newListTitle.trim();
    if (trimmed) {
      onAddList(trimmed);
      setNewListTitle('');
      setShowAddList(false);
    }
  };

  const listIds = board.lists.map((l) => l.id);
  const commentModalCard = commentModalCardId ? getCardById(commentModalCardId) : null;

  return (
    <div className={styles.board}>
      <BoardHeader title={board.title} onTitleChange={onBoardTitleChange} />
      <div className={styles.boardBody}>
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className={styles.listsContainer}>
            <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
              {board.lists.map((list) => (
                <SortableListWrapper
                  key={list.id}
                  list={list}
                  onListTitleChange={(title) => onListTitleChange(list.id, title)}
                  onListDelete={() => onListDelete(list.id)}
                  onAddCard={(title) => onAddCard(list.id, title)}
                  onCardTitleChange={onCardTitleChange}
                  onOpenCommentModal={setCommentModalCardId}
                />
              ))}
            </SortableContext>
            <div className={styles.addList}>
              {showAddList ? (
                <div className={styles.addListForm}>
                  <input
                    className={styles.addListInput}
                    placeholder="List title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === ' ') e.stopPropagation();
                      if (e.key === 'Enter') submitNewList();
                      if (e.key === 'Escape') {
                        setShowAddList(false);
                        setNewListTitle('');
                      }
                    }}
                    autoFocus
                  />
                  <div className={styles.addListActions}>
                    <button type="button" className={styles.addListSubmit} onClick={submitNewList}>
                      Add
                    </button>
                    <button
                      type="button"
                      className={styles.addListCancel}
                      onClick={() => {
                        setShowAddList(false);
                        setNewListTitle('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.addListBtn}
                  onClick={() => setShowAddList(true)}
                >
                  + Add list
                </button>
              )}
            </div>
          </div>
        </DndContext>
      </div>
      {commentModalCard && (
        <CommentModal
          card={commentModalCard}
          onAddComment={(text) => onAddComment(commentModalCardId!, text)}
          onClose={() => setCommentModalCardId(null)}
        />
      )}
    </div>
  );
}
