'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef, useEffect } from 'react';
import type { Card as CardType } from '@/types/board';
import styles from './Card.module.scss';

interface CardProps {
  card: CardType;
  onTitleChange: (title: string) => void;
  onOpenComments: () => void;
}

export function Card({ card, onTitleChange, onOpenComments }: CardProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(card.title);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', cardId: card.id, listId: card.listId },
  });

  useEffect(() => {
    setValue(card.title);
  }, [card.title]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed) onTitleChange(trimmed);
    setEditing(false);
  };

  const commentCount = card.comments.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
      {...listeners}
    >
      {editing ? (
        <textarea
          ref={inputRef}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
            if (e.key === 'Escape') {
              setValue(card.title);
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          data-testid="card-title-input"
        />
      ) : (
        <>
          <div
            className={styles.title}
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
          >
            {card.title}
          </div>
          <button
            type="button"
            className={styles.commentBadge}
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments();
            }}
          >
            💬 {commentCount > 0 ? commentCount : 'comment'}
          </button>
        </>
      )}
    </div>
  );
}
