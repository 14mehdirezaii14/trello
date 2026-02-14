'use client';

import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { List as ListType } from '@/types/board';
import { Card } from '@/components/Card';
import styles from './List.module.scss';

interface ListProps {
  list: ListType;
  onListTitleChange: (title: string) => void;
  onListDelete: () => void;
  onAddCard: (title: string) => void;
  onCardTitleChange: (cardId: string, title: string) => void;
  onOpenCommentModal: (cardId: string) => void;
}

export function List({
  list,
  onListTitleChange,
  onListDelete,
  onAddCard,
  onCardTitleChange,
  onOpenCommentModal,
}: ListProps) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const cardInputRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: `list-${list.id}`,
    data: { type: 'list', listId: list.id },
  });

  useEffect(() => {
    if (showAddCard) cardInputRef.current?.focus();
  }, [showAddCard]);

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.select();
  }, [editingTitle]);

  const submitCard = () => {
    const trimmed = newCardTitle.trim();
    if (trimmed) {
      onAddCard(trimmed);
      setNewCardTitle('');
      setShowAddCard(false);
    }
  };

  const submitTitle = () => {
    const trimmed = draftTitle.trim();
    if (trimmed) onListTitleChange(trimmed);
    setEditingTitle(false);
  };

  const startEditingTitle = () => {
    setDraftTitle(list.title);
    setEditingTitle(true);
  };

  const cardIds = list.cards.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      className={`${styles.list} ${isOver ? styles.droppable : ''}`}
    >
      <div className={styles.listHeader}>
        {editingTitle ? (
          <input
            ref={titleInputRef}
            className={styles.titleInput}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={submitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitTitle();
              if (e.key === 'Escape') {
                setEditingTitle(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3
            className={styles.listTitle}
            onClick={startEditingTitle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && startEditingTitle()}
          >
            {list.title}
          </h3>
        )}
        <div className={styles.menuWrap}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="List menu"
          >
            ⋮
          </button>
          {menuOpen && (
            <>
              <div className={styles.menuBackdrop} onClick={() => setMenuOpen(false)} />
              <div className={styles.menu}>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.confirm('Delete this list?')) onListDelete();
                    setMenuOpen(false);
                  }}
                >
                  Delete list
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.cards}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {list.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onTitleChange={(title) => onCardTitleChange(card.id, title)}
              onOpenComments={() => onOpenCommentModal(card.id)}
            />
          ))}
        </SortableContext>
      </div>
      {showAddCard ? (
        <div className={styles.addCardForm}>
          <textarea
            ref={cardInputRef}
            className={styles.cardTextarea}
            placeholder="Card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitCard();
              }
              if (e.key === 'Escape') {
                setShowAddCard(false);
                setNewCardTitle('');
              }
            }}
            rows={3}
          />
          <div className={styles.addCardActions}>
            <button type="button" className={styles.addCardSubmit} onClick={submitCard}>
              Add card
            </button>
            <button
              type="button"
              className={styles.addCardCancel}
              onClick={() => {
                setShowAddCard(false);
                setNewCardTitle('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={styles.addCardBtn}
          onClick={() => setShowAddCard(true)}
        >
          + Add card
        </button>
      )}
    </div>
  );
}
