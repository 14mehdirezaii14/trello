'use client';

import { useState, useRef, useEffect } from 'react';
import type { Card as CardType, Comment } from '@/types/board';
import styles from './CommentModal.module.scss';

interface CommentModalProps {
  card: CardType;
  onAddComment: (text: string) => void;
  onClose: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CommentModal({ card, onAddComment, onClose }: CommentModalProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onAddComment(trimmed);
      setText('');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.cardTitle}>{card.title}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Comments</h3>
          <div className={styles.commentList}>
            {card.comments.length === 0 ? (
              <p className={styles.empty}>No comments yet.</p>
            ) : (
              card.comments.map((c: Comment) => (
                <div key={c.id} className={styles.commentItem}>
                  <p className={styles.commentText}>{c.text}</p>
                  <span className={styles.commentDate}>{formatDate(c.createdAt)}</span>
                </div>
              ))
            )}
          </div>
          <div className={styles.addComment}>
            <textarea
              ref={inputRef}
              className={styles.textarea}
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={3}
            />
            <button type="button" className={styles.submitBtn} onClick={submit} disabled={!text.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
