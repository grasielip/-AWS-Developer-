const USER_STORAGE_KEY = 'awsExam_currentUser';
const USER_DATA_PREFIX = 'awsExam_user_';

function getCertificationOptions() {
  return [
    { key: 'clf-c02', label: 'AWS Certified Cloud Practitioner (CLF-C02)', level: 'practitioner' },
    { key: 'aif-c01', label: 'AWS Certified AI Practitioner (AIF-C01)', level: 'practitioner' },
    { key: 'saa-c03', label: 'AWS Certified Solutions Architect – Associate (SAA-C03)', level: 'associate' },
    { key: 'dva-c02', label: 'AWS Certified Developer – Associate (DVA-C02)', level: 'associate' },
    { key: 'soa-c02', label: 'AWS Certified SysOps Administrator – Associate (SOA-C02)', level: 'associate' },
    { key: 'dea-c01', label: 'AWS Certified Data Engineer – Associate (DEA-C01)', level: 'associate' },
    { key: 'mla-c01', label: 'AWS Certified Machine Learning Engineer – Associate (MLA-C01)', level: 'associate' },
    { key: 'sap-c02', label: 'AWS Certified Solutions Architect – Professional (SAP-C02)', level: 'professional' },
    { key: 'dop-c02', label: 'AWS Certified DevOps Engineer – Professional (DOP-C02)', level: 'professional' },
    { key: 'ans-c01', label: 'AWS Certified Advanced Networking – Specialty (ANS-C01)', level: 'specialty' },
    { key: 'scs-c02', label: 'AWS Certified Security – Specialty (SCS-C02)', level: 'specialty' },
    { key: 'mls-c01', label: 'AWS Certified Machine Learning – Specialty (MLS-C01)', level: 'specialty' }
  ];
}

function getDomainsForCertification(certKey) {
  const domainMap = {
    'dva-c02': ['Todos', 'Development with AWS Services', 'Security', 'Deployment', 'Troubleshooting and Optimization'],
    'saa-c03': ['Todos', 'Design Resilient Architectures', 'Design High-Performing Architectures', 'Design Secure Applications and Architectures', 'Design Cost-Optimized Architectures'],
    'soa-c02': ['Todos', 'Monitoring and Logging', 'Deployment and Provisioning', 'Security', 'Networking'],
    'mls-c01': ['Todos', 'Data Engineering', 'Exploratory Data Analysis', 'Modeling', 'Machine Learning Implementation and Operations'],
    'ans-c01': ['Todos', 'Networking', 'Security', 'Optimization'],
    'scs-c02': ['Todos', 'Security', 'Risk and Compliance'],
    'clf-c02': ['Todos', 'Cloud Concepts', 'Security and Compliance', 'Technology'],
    'aif-c01': ['Todos', 'AI/ML Concepts', 'AWS AI Services', 'Security', 'Deployment'],
    'sap-c02': ['Todos', 'Migration Planning', 'Designing Resilient Architectures', 'Security and Compliance'],
    'dop-c02': ['Todos', 'SDLC Automation', 'Configuration Management', 'Monitoring and Logging'],
    'dea-c01': ['Todos', 'Data Collection', 'Data Storage', 'Data Processing', 'Analytics'],
    'mla-c01': ['Todos', 'Data Engineering', 'Exploratory Data Analysis', 'Modeling', 'ML Deployment']
  };

  if (certKey === 'all') {
    const allDomains = new Set();
    Object.values(domainMap).forEach((domains) => domains.slice(1).forEach((domain) => allDomains.add(domain)));
    return ['Todos', ...Array.from(allDomains).sort()];
  }

  return domainMap[certKey] || ['Todos'];
}

function getFilterSummaryText() {
  const { level, certification, domain } = appState.filters;
  const certificationLabel = certification === 'all'
    ? 'Todas as certificações'
    : getCertificationOptions().find((item) => item.key === certification)?.label || 'Certificação selecionada';
  const domainLabel = domain === 'all' ? 'Todos os domínios' : domain;
  const levelLabel = level === 'all' ? 'Todos os níveis' : level.charAt(0).toUpperCase() + level.slice(1);
  return `Filtros: ${levelLabel} / ${certificationLabel} / ${domainLabel}`;
}

function updateFilterSummary() {
  const filterSummary = document.getElementById('filter-summary');
  if (filterSummary) {
    filterSummary.textContent = getFilterSummaryText();
  }
}

function clearFilters() {
  appState.filters = { level: 'all', certification: 'all', domain: 'all' };
  const levelSelects = document.querySelectorAll('.filter-level');
  const certificationSelects = document.querySelectorAll('.filter-certification');
  const domainSelects = document.querySelectorAll('.filter-domain');
  levelSelects.forEach((el) => { el.value = 'all'; });
  populateCertificationOptions('all');
  certificationSelects.forEach((el) => { el.value = 'all'; });
  populateDomainOptions('all');
  domainSelects.forEach((el) => { el.value = 'all'; });
  applyFilters();
}

function getStoredUserData(username) {
  const raw = localStorage.getItem(`${USER_DATA_PREFIX}${username}`);
  return raw ? JSON.parse(raw) : null;
}

function saveCurrentUserData() {
  if (!appState.user) return;
  const data = {
    filters: appState.filters,
    answeredCount: appState.answeredCount,
    correctCount: appState.correctCount,
    reviewedCount: appState.reviewedCount
  };
  localStorage.setItem(`${USER_DATA_PREFIX}${appState.user}`, JSON.stringify(data));
}

function updateUserSummary() {
  const summary = document.getElementById('user-summary');
  if (!summary) return;

  if (!appState.user) {
    summary.classList.add('hidden');
    return;
  }

  summary.classList.remove('hidden');
  summary.innerHTML = `
    <strong>Usuário:</strong> ${appState.user}<br />
    <strong>Progresso salvo:</strong> ${appState.answeredCount} questões respondidas, ${appState.correctCount} corretas, ${appState.reviewedCount} flashcards revisados
  `;
}

function updateLoginElements() {
  const loginWrapper = document.getElementById('login-link-wrapper');
  const logoutButton = document.getElementById('logout-button');
  if (!loginWrapper || !logoutButton) return;

  if (appState.user) {
    loginWrapper.classList.add('hidden');
    logoutButton.classList.remove('hidden');
  } else {
    loginWrapper.classList.remove('hidden');
    logoutButton.classList.add('hidden');
  }
}

function setUser(username) {
  appState.user = username;
  localStorage.setItem(USER_STORAGE_KEY, username);

  const stored = getStoredUserData(username);
  if (stored) {
    appState.filters = stored.filters || { level: 'all', certification: 'all', domain: 'all' };
    appState.answeredCount = stored.answeredCount || 0;
    appState.correctCount = stored.correctCount || 0;
    appState.reviewedCount = stored.reviewedCount || 0;
  } else {
    appState.filters = { level: 'all', certification: 'all', domain: 'all' };
    appState.answeredCount = 0;
    appState.correctCount = 0;
    appState.reviewedCount = 0;
  }

  updateUserSummary();
  updateLoginElements();
  const levelSelects = document.querySelectorAll('.filter-level');
  const certificationSelects = document.querySelectorAll('.filter-certification');
  const domainSelects = document.querySelectorAll('.filter-domain');
  levelSelects.forEach((el) => { el.value = appState.filters.level; });
  populateCertificationOptions(appState.filters.level);
  certificationSelects.forEach((el) => { el.value = appState.filters.certification; });
  populateDomainOptions(appState.filters.certification);
  domainSelects.forEach((el) => { el.value = appState.filters.domain; });
  applyFilters();
  updateDashboard();
}

function logoutUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
  appState.user = null;
  updateUserSummary();
  updateLoginElements();
}

function handleLogout() {
  logoutUser();
  clearFilters();
  updateDashboard();
}

function applyFilters() {
  const { level, certification, domain } = appState.filters;
  appState.quiz = appState.fullQuiz.filter((item) => {
    const levelMatch = level === 'all' || getCertificationOptions().some((c) => c.key === item.certificationKey && c.level === level);
    const certMatch = certification === 'all' || item.certificationKey === certification;
    const domainMatch = domain === 'all' || item.domain === domain;
    return levelMatch && certMatch && domainMatch;
  });

  appState.filteredFlashcards = appState.flashcards.filter((item) => {
    const levelMatch = level === 'all' || getCertificationOptions().some((c) => c.key === item.certificationKey && c.level === level);
    const certMatch = certification === 'all' || item.certificationKey === certification;
    const domainMatch = domain === 'all' || item.domain === domain;
    return levelMatch && certMatch && domainMatch;
  });

  appState.currentQuestionIndex = 0;
  appState.currentFlashcardIndex = 0;
  renderQuiz();
  renderFlashcard();
  updateFilterSummary();
  saveCurrentUserData();
}

function setupFilterListeners() {
  const levelSelects = document.querySelectorAll('.filter-level');
  const certificationSelects = document.querySelectorAll('.filter-certification');
  const domainSelects = document.querySelectorAll('.filter-domain');
  const clearButton = document.getElementById('clear-filters');

  levelSelects.forEach((select) => {
    select.addEventListener('change', (event) => {
      const value = event.target.value;
      appState.filters.level = value;
      document.querySelectorAll('.filter-level').forEach((el) => { el.value = value; });
      populateCertificationOptions(appState.filters.level);
      document.querySelectorAll('.filter-certification').forEach((el) => { el.value = 'all'; });
      populateDomainOptions('all');
      document.querySelectorAll('.filter-domain').forEach((el) => { el.value = 'all'; });
      appState.filters.certification = 'all';
      appState.filters.domain = 'all';
      applyFilters();
    });
  });

  certificationSelects.forEach((select) => {
    select.addEventListener('change', (event) => {
      const value = event.target.value;
      appState.filters.certification = value;
      document.querySelectorAll('.filter-certification').forEach((el) => { el.value = value; });
      populateDomainOptions(appState.filters.certification);
      document.querySelectorAll('.filter-domain').forEach((el) => { el.value = 'all'; });
      appState.filters.domain = 'all';
      applyFilters();
    });
  });

  domainSelects.forEach((select) => {
    select.addEventListener('change', (event) => {
      const value = event.target.value;
      appState.filters.domain = value;
      document.querySelectorAll('.filter-domain').forEach((el) => { el.value = value; });
      applyFilters();
    });
  });

  clearButton.addEventListener('click', clearFilters);
}

function loadPersistentUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) {
    window.location.href = 'login.html';
    return;
  }
  setUser(storedUser);
}

async function init() {
  await loadData();
  populateCertificationOptions('all');
  populateDomainOptions('all');
  setupFilterListeners();
  loadPersistentUser();
  if (!appState.user) return;
  applyFilters();
  renderFlashcard();
  updateDashboard();

  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === button.dataset.view));
      document.querySelectorAll('.nav-btn').forEach((navBtn) => navBtn.classList.toggle('active', navBtn.dataset.view === button.dataset.view));
    });
  });

  document.getElementById('next-question').addEventListener('click', nextQuestion);
  const toggleButton = document.getElementById('toggle-answer');
  if (toggleButton) toggleButton.addEventListener('click', toggleFlashcardAnswer);
  document.getElementById('next-flashcard').addEventListener('click', nextFlashcard);
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) logoutButton.addEventListener('click', handleLogout);
}

init();
