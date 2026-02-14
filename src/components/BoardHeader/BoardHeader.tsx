'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './BoardHeader.module.scss';

interface BoardHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
}

export function BoardHeader({ title, onTitleChange }: BoardHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(title);
  }, [title]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed) onTitleChange(trimmed);
    setEditing(false);
  };

  return (
    <header className={styles.header}>
      {editing ? (
        <input
          ref={inputRef}
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={submit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') {
              setValue(title);
              setEditing(false);
            }
          }}
          autoFocus
          data-testid="board-title-input"
        />
      ) : (
        <h1
          className={styles.title}
          onClick={() => setEditing(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setEditing(true)}
        >
          {title}
        </h1>
      )}
    </header>
  );
}
