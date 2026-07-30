const appState = {
  fullQuiz: [],
  quiz: [],
  flashcards: [],
  filteredFlashcards: [],
  currentQuestionIndex: 0,
  currentFlashcardIndex: 0,
  answeredCount: 0,
  correctCount: 0,
  reviewedCount: 0,
  filters: {
    level: 'all',
    certification: 'all',
    domain: 'all'
  }
};

function normalizeCertification(raw) {
  const value = String(raw || '').toLowerCase();
  if (value.includes('cloud practitioner') || value.includes('practitioner')) return 'clf-c02';
  if (value.includes('ai practitioner')) return 'aif-c01';
  if (value.includes('solutions architect') && value.includes('associate')) return 'saa-c03';
  if (value.includes('developer') && value.includes('associate')) return 'dva-c02';
  if (value.includes('sysops')) return 'soa-c02';
  if (value.includes('data engineer')) return 'dea-c01';
  if (value.includes('machine learning engineer')) return 'mla-c01';
  if (value.includes('solutions architect') && value.includes('professional')) return 'sap-c02';
  if (value.includes('devops engineer')) return 'dop-c02';
  if (value.includes('advanced networking')) return 'ans-c01';
  if (value.includes('security')) return 'scs-c02';
  if (value.includes('machine learning') && value.includes('specialty')) return 'mls-c01';
  return value || 'unknown';
}

async function loadData() {
  const response = await fetch('data/developer.json');
  const data = await response.json();

  const loadedQuiz = (Array.isArray(data) ? data : data.quiz || []).map((item) => ({
    question: item.pergunta || item.question || '',
    options: item.alternativas || item.options || [],
    answer: item.resposta !== undefined ? item.resposta : item.answer,
    certificationKey: normalizeCertification(item.certificacao || item.certification),
    certificationLabel: item.certificacao || item.certification || 'Developer Associate',
    level: (item.nivel || item.level || '').toLowerCase(),
    domain: item.dominio || item.category || '',
    explanation: item.explicacao || item.explanation || ''
  }));

  appState.fullQuiz = loadedQuiz;
  appState.quiz = [...loadedQuiz];
  appState.flashcards = Array.isArray(data)
    ? loadedQuiz.map((item) => ({
        front: item.question,
        back: item.explanation || item.options[item.answer] || 'Resposta não disponível',
        certificationKey: item.certificationKey,
        domain: item.domain
      }))
    : data.flashcards || [];
  appState.filteredFlashcards = [...appState.flashcards];
}

function getCurrentQuestion() {
  return appState.quiz[appState.currentQuestionIndex];
}

function getCurrentFlashcard() {
  return appState.filteredFlashcards[appState.currentFlashcardIndex];
}
