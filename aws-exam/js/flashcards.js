function renderFlashcard() {
  const flashcard = getCurrentFlashcard();
  const card = document.getElementById('flashcard');
  const front = card.querySelector('.front');
  const back = card.querySelector('.back');
  const toggleButton = document.getElementById('toggle-answer');

  if (!flashcard) {
    front.innerHTML = '<p>Nenhum flashcard disponível para o filtro atual.</p>';
    back.innerHTML = '';
    card.classList.remove('revealed');
    if (toggleButton) toggleButton.textContent = 'Mostrar resposta';
    return;
  }

  front.innerHTML = `<strong>${flashcard.front}</strong>`;
  back.innerHTML = `<strong>${flashcard.back}</strong>`;
  card.classList.remove('revealed');
  if (toggleButton) toggleButton.textContent = 'Mostrar resposta';
}

function toggleFlashcardAnswer() {
  const card = document.getElementById('flashcard');
  const toggleButton = document.getElementById('toggle-answer');
  if (!card || !toggleButton) return;

  const isRevealed = card.classList.toggle('revealed');
  if (isRevealed) {
    appState.reviewedCount += 1;
    toggleButton.textContent = 'Ocultar resposta';
  } else {
    toggleButton.textContent = 'Mostrar resposta';
  }

  updateDashboard();
}

function nextFlashcard() {
  if (appState.filteredFlashcards.length === 0) return;
  appState.currentFlashcardIndex = (appState.currentFlashcardIndex + 1) % appState.filteredFlashcards.length;
  renderFlashcard();
}
