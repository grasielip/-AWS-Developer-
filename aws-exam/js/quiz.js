let quizAnswered = false;

function renderQuiz() {
  const question = getCurrentQuestion();
  const questionContainer = document.getElementById('quiz-question');
  const optionsContainer = document.getElementById('quiz-options');

  if (!question || appState.quiz.length === 0) {
    questionContainer.innerHTML = '<h3>Nenhuma pergunta disponível para o filtro selecionado.</h3>';
    optionsContainer.innerHTML = '';
    return;
  }

  questionContainer.innerHTML = `<h3>${question.question}</h3>`;
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(index));
    optionsContainer.appendChild(button);
  });

  quizAnswered = false;
}

function handleAnswer(selectedIndex) {
  if (quizAnswered) return;

  const question = getCurrentQuestion();
  if (!question) return;

  const buttons = document.querySelectorAll('.option-btn');

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) {
      button.classList.add('correct');
    } else if (index === selectedIndex && selectedIndex !== question.answer) {
      button.classList.add('wrong');
    }
  });

  appState.answeredCount += 1;
  if (selectedIndex === question.answer) {
    appState.correctCount += 1;
  }

  quizAnswered = true;
  updateDashboard();
}

function nextQuestion() {
  if (appState.quiz.length === 0) return;
  appState.currentQuestionIndex = (appState.currentQuestionIndex + 1) % appState.quiz.length;
  renderQuiz();
}
