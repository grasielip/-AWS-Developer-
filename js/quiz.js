/**
 * Lógica do Simulado / Modo Estudo
 */
class QuizEngine {
  constructor() {
    this.currentQuestions = [];
    this.currentIndex = 0;
    this.userAnswers = {};
    this.mode = 'study'; // 'study' ou 'exam'
    this.timer = null;
    this.secondsElapsed = 0;
  }

  startQuiz(questions, mode = 'study') {
    this.currentQuestions = questions;
    this.mode = mode;
    this.currentIndex = 0;
    this.userAnswers = {};
    this.secondsElapsed = 0;

    this.startTimer();
    this.renderQuestion();
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.secondsElapsed++;
      const mins = String(Math.floor(this.secondsElapsed / 60)).padStart(2, '0');
      const secs = String(this.secondsElapsed % 60).padStart(2, '0');
      document.getElementById('timer-display').innerText = `${mins}:${secs}`;
    }, 1000);
  }

  isMultiAnswer(question) {
    return Array.isArray(question.resposta);
  }

  areAnswersCorrect(question, selected) {
    if (this.isMultiAnswer(question)) {
      const expected = [...question.resposta].sort((a, b) => a - b);
      const actual = Array.isArray(selected) ? [...new Set(selected)].sort((a, b) => a - b) : [];
      return expected.length === actual.length && expected.every((value, index) => value === actual[index]);
    }
    return selected === question.resposta;
  }

  renderQuestion() {
    const q = this.currentQuestions[this.currentIndex];
    if (!q) return;

    document.getElementById('current-q-index').innerText = this.currentIndex + 1;
    document.getElementById('total-q-count').innerText = this.currentQuestions.length;
    this.updateProgressBar();
    document.getElementById('q-domain').innerText = q.dominio;
    document.getElementById('q-level').innerText = q.nivel;
    document.getElementById('question-text').innerText = q.pergunta;
    document.getElementById('question-help').innerText = this.isMultiAnswer(q)
      ? 'Selecione todas as respostas corretas.'
      : 'Selecione a alternativa correta.';

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    q.alternativas.forEach((alt, idx) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option-item';
      const selectedAnswer = this.userAnswers[this.currentIndex];
      const isSelected = this.isMultiAnswer(q)
        ? Array.isArray(selectedAnswer) && selectedAnswer.includes(idx)
        : selectedAnswer === idx;

      if (isSelected) {
        optionDiv.classList.add('selected');
      }

      optionDiv.innerHTML = `
        <span class="option-prefix">${String.fromCharCode(65 + idx)})</span>
        <span>${alt}</span>
      `;

      optionDiv.addEventListener('click', () => this.selectOption(idx));
      optionsContainer.appendChild(optionDiv);
    });

    // Ocultar ou mostrar caixa de explicação
    const expBox = document.getElementById('explanation-box');
    expBox.classList.add('hidden');

    if (this.mode === 'study' && this.userAnswers[this.currentIndex] !== undefined) {
      this.showExplanation();
    }

    this.updateControls();
    if (typeof app !== 'undefined' && typeof app.updateFlagButton === 'function') {
      const isFlagged = dbManager.isQuestionFlagged(q.id);
      app.updateFlagButton(isFlagged);
    }
  }

  selectOption(optionIndex) {
    const q = this.currentQuestions[this.currentIndex];

    if (this.isMultiAnswer(q)) {
      const selected = this.userAnswers[this.currentIndex] || [];
      if (selected.includes(optionIndex)) {
        this.userAnswers[this.currentIndex] = selected.filter((idx) => idx !== optionIndex);
      } else {
        this.userAnswers[this.currentIndex] = [...selected, optionIndex];
      }
    } else {
      this.userAnswers[this.currentIndex] = optionIndex;
    }

    this.updateQuestionStatus(q);
    this.renderQuestion();

    if (this.mode === 'study') {
      this.showExplanation();
    }
  }

  updateQuestionStatus(question) {
    const selected = this.userAnswers[this.currentIndex];
    if (selected === undefined || (Array.isArray(selected) && selected.length === 0)) {
      dbManager.setQuestionStatus(question.id, 'not-answered');
      return;
    }

    if (this.areAnswersCorrect(question, selected)) {
      dbManager.setQuestionStatus(question.id, 'correct');
    } else {
      dbManager.setQuestionStatus(question.id, 'incorrect');
    }
  }

  showExplanation() {
    const q = this.currentQuestions[this.currentIndex];
    const selected = this.userAnswers[this.currentIndex];
    const expBox = document.getElementById('explanation-box');
    const expStatus = document.getElementById('explanation-status');
    const expText = document.getElementById('explanation-content');

    expBox.classList.remove('hidden');

    const isCorrect = this.areAnswersCorrect(q, selected);

    if (isCorrect) {
      expStatus.innerHTML = '<span style="color:var(--correct-green)"><i class="fa-solid fa-circle-check"></i> Resposta Correta!</span>';
    } else {
      expStatus.innerHTML = '<span style="color:var(--incorrect-red)"><i class="fa-solid fa-circle-xmark"></i> Resposta Incorreta</span>';
    }

    expText.innerText = q.explicacao;
  }

  updateControls() {
    document.getElementById('btn-prev-q').disabled = this.currentIndex === 0;
    const isLast = this.currentIndex === this.currentQuestions.length - 1;
    
    document.getElementById('btn-next-q').classList.toggle('hidden', isLast);
    document.getElementById('btn-finish-quiz').classList.toggle('hidden', !isLast);
  }

  updateProgressBar() {
    const progressFill = document.getElementById('quiz-progress-fill');
    if (!progressFill || this.currentQuestions.length === 0) return;

    const percent = Math.round(((this.currentIndex + 1) / this.currentQuestions.length) * 100);
    progressFill.style.width = `${percent}%`;
    progressFill.setAttribute('aria-valuenow', percent.toString());
  }

  nextQuestion() {
    if (this.currentIndex < this.currentQuestions.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderQuestion();
    }
  }

  finishQuiz() {
    clearInterval(this.timer);
    let correct = 0;

    this.currentQuestions.forEach((q, idx) => {
      const answer = this.userAnswers[idx];
      if (answer === undefined || (Array.isArray(answer) && answer.length === 0)) {
        dbManager.setQuestionStatus(q.id, 'not-answered');
      } else if (this.areAnswersCorrect(q, answer)) {
        dbManager.setQuestionStatus(q.id, 'correct');
        correct++;
      } else {
        dbManager.setQuestionStatus(q.id, 'incorrect');
      }
    });

    const total = this.currentQuestions.length;
    const accuracy = Math.round((correct / total) * 100);

    // Salvar progresso
    const userData = dbManager.getUserData();
    userData.answeredCount += total;
    userData.correctCount += correct;
    userData.incorrectCount += (total - correct);
    userData.history.push({ date: new Date().toLocaleDateString(), accuracy });

    dbManager.saveUserData(userData);
    dbManager.addXP(correct * 10);

    alert(`Simulado Concluído!\n\nAcertos: ${correct}/${total}\nPrecisão: ${accuracy}%`);
    app.switchView('view-dashboard');
  }
}

const quizEngine = new QuizEngine();