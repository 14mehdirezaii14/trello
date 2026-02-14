'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { List as ListType } from '@/types/board';
import { List } from '@/components/List';

interface SortableListWrapperProps {
  list: ListType;
  onListTitleChange: (title: string) => void;
  onListDelete: () => void;
  onDeleteAllCards: () => void;
  onAddCard: (title: string) => void;
  onCardTitleChange: (cardId: string, title: string) => void;
  onOpenCommentModal: (cardId: string) => void;
}

export function SortableListWrapper({
  list,
  onListTitleChange,
  onListDelete,
  onDeleteAllCards,
  onAddCard,
  onCardTitleChange,
  onOpenCommentModal,
}: SortableListWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: { type: 'list', listId: list.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: 272,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={isDragging ? 'list-dragging' : ''}>
      <List
        list={list}
        onListTitleChange={onListTitleChange}
        onListDelete={onListDelete}
        onDeleteAllCards={onDeleteAllCards}
        onAddCard={onAddCard}
        onCardTitleChange={onCardTitleChange}
        onOpenCommentModal={onOpenCommentModal}
      />
    </div>
  );
}
