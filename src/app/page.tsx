'use client';

import { useBoard } from '@/hooks/useBoard';
import { Board } from '@/components/Board';

export default function Home() {
  const {
    board,
    updateBoardTitle,
    addList,
    updateList,
    deleteList,
    reorderLists,
    addCard,
    updateCard,
    moveCard,
    reorderCardsInList,
    addComment,
    getCardById,
  } = useBoard();

  if (!board) {
    return (
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        Loading...
      </main>
    );
  }

  return (
    <main>
      <Board
        board={board}
        onBoardTitleChange={updateBoardTitle}
        onAddList={addList}
        onListTitleChange={(listId, title) => updateList(listId, { title })}
        onListDelete={deleteList}
        onReorderLists={reorderLists}
        onAddCard={addCard}
        onCardTitleChange={(cardId, title) => updateCard(cardId, { title })}
        onMoveCard={moveCard}
        onReorderCardsInList={reorderCardsInList}
        onAddComment={addComment}
        getCardById={getCardById}
      />
    </main>
  );
}
