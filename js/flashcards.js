/**
 * Controle de Flashcards
 */
class FlashcardEngine {
  constructor() {
    this.originalCards = [];
    this.cards = [];
    this.index = 0;
  }

  init(questions) {
    this.originalCards = Array.isArray(questions) ? [...questions] : [];
    this.cards = [...this.originalCards];
    this.index = 0;
    this.render();

    document.getElementById('flashcard-element').addEventListener('click', () => {
      document.getElementById('flashcard-element').classList.toggle('flipped');
    });

    document.getElementById('btn-fc-next').addEventListener('click', () => this.next());
    document.getElementById('btn-fc-prev').addEventListener('click', () => this.prev());
  }

  filter({ level = 'all', certification = 'all', domain = 'all', difficulty = 'all', service = 'all' } = {}) {
    this.cards = this.originalCards.filter(card => {
      if (level !== 'all') {
        const cardLevel = (card.levelCategory || card.nivel || card.level || '').toLowerCase();
        if (cardLevel !== level.toLowerCase()) return false;
      }

      if (certification !== 'all') {
        const cardCert = (card.certificationKey || card.certificacao || card.certification || '').toLowerCase();
        if (cardCert !== certification.toLowerCase()) return false;
      }

      if (domain !== 'all') {
        const cardDomain = (card.domain || card.dominio || card.category || '');
        if (cardDomain !== domain) return false;
      }

      if (difficulty !== 'all') {
        const cardDifficulty = (card.difficulty || card.nivel || card.dificuldade || card.difficulty || '').toLowerCase();
        if (cardDifficulty !== difficulty.toLowerCase()) return false;
      }

      if (service !== 'all') {
        const cardServices = Array.isArray(card.services)
          ? card.services.map(s => s.toLowerCase())
          : [];
        if (!cardServices.includes(service.toLowerCase())) return false;
      }

      return true;
    });

    this.index = 0;
    this.render();
  }

  render() {
    const card = this.cards[this.index];
    const flashcardElement = document.getElementById('flashcard-element');

    if (!card) {
      if (flashcardElement) {
        flashcardElement.classList.remove('flipped');
      }
      document.getElementById('fc-domain').innerText = 'Nenhum resultado';
      document.getElementById('fc-front-text').innerText = 'Nenhum flashcard disponível para o filtro selecionado.';
      document.getElementById('fc-back-text').innerText = '';
      return;
    }

    document.getElementById('flashcard-element').classList.remove('flipped');
    document.getElementById('fc-domain').innerText = card.dominio;
    document.getElementById('fc-front-text').innerText = card.pergunta;
    document.getElementById('fc-back-text').innerText = `${card.alternativas[card.resposta]}\n\n${card.explicacao}`;
  }

  next() {
    if (this.index < this.cards.length - 1) {
      this.index++;
      this.render();
    }
  }

  prev() {
    if (this.index > 0) {
      this.index--;
      this.render();
    }
  }
}

const flashcardEngine = new FlashcardEngine();