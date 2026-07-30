/**
 * Controlador Principal da Aplicação
 */
class App {
  constructor() {
    this.init();
  }

  async init() {
    await dbManager.loadQuestions();
    this.bindEvents();
    this.updateUserUI();
    this.updateQuestionStats();
    flashcardEngine.init(dbManager.questions);
  }

  bindEvents() {
    // Troca de Views da Sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('data-target');
        this.switchView(target);
        
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Iniciar Simulado Rápido na Home
    document.getElementById('btn-quick-start').addEventListener('click', () => {
      this.switchView('view-quiz-active');
      quizEngine.startQuiz(dbManager.questions.slice(0, 10), 'study');
    });

    // Form de Configuração do Simulado
    const certificationDomains = {
      'cloud-practitioner': [
        'Cloud Concepts',
        'Security and Compliance',
        'Cloud Technology and Services',
        'Billing, Pricing and Support'
      ],
      'ai-practitioner': [
        'Fundamentals of AI and ML',
        'Fundamentals of Generative AI',
        'Applications of Foundation Models',
        'Guidelines for Responsible AI',
        'Security, Compliance and Governance for AI Solutions'
      ],
      'architect-associate': [
        'Design Secure Architectures',
        'Design Resilient Architectures',
        'Design High-Performing Architectures',
        'Design Cost-Optimized Architectures'
      ],
      'developer-associate': [
        'Development with AWS Services',
        'Security',
        'Deployment',
        'Troubleshooting and Optimization'
      ],
      'sysops-associate': [
        'Monitoring, Logging and Remediation',
        'Reliability and Business Continuity',
        'Deployment, Provisioning and Automation',
        'Security and Compliance',
        'Networking and Content Delivery',
        'Cost and Performance Optimization'
      ],
      'data-engineer-associate': [
        'Data Ingestion and Transformation',
        'Data Store Management',
        'Data Operations and Support',
        'Data Security and Governance'
      ],
      'ml-engineer-associate': [
        'Data Preparation for ML',
        'ML Model Development',
        'Deployment and Orchestration',
        'Monitoring, Maintenance and Security'
      ],
      'architect-professional': [
        'Design Solutions for Organizational Complexity',
        'Design for New Solutions',
        'Continuous Improvement for Existing Solutions',
        'Accelerate Workload Migration and Modernization',
        'Cost Control'
      ],
      'devops-professional': [
        'SDLC Automation',
        'Configuration Management and Infrastructure as Code',
        'Resilient Cloud Solutions',
        'Monitoring and Logging',
        'Incident and Event Response',
        'Security and Compliance',
        'High Availability, Fault Tolerance and Disaster Recovery'
      ],
      'security-specialty': [
        'Threat Detection',
        'Security Incident Response',
        'Security Infrastructure',
        'Identity and Access Management',
        'Data Protection',
        'Management and Security Governance'
      ],
      'advanced-networking-specialty': [
        'Network Design',
        'Network Implementation',
        'Network Management and Operation',
        'Network Security, Compliance and Automation',
        'Troubleshooting'
      ]
    };

    const certificationSelect = document.getElementById('config-certification');
    const domainSelect = document.getElementById('config-domain');
    const levelSelect = document.getElementById('config-level');
    const difficultySelect = document.getElementById('config-difficulty');
    const serviceSelect = document.getElementById('config-service');
    const statusSelect = document.getElementById('config-status');

    const certificationQuestionMap = {
      'cloud-practitioner': 'cloud-practitioner',
      'ai-practitioner': 'ai-practitioner',
      'architect-associate': 'architect-associate',
      'developer-associate': 'developer-associate',
      'sysops-associate': 'sysops-associate',
      'data-engineer-associate': 'data-engineer-associate',
      'ml-engineer-associate': 'ml-engineer-associate',
      'architect-professional': 'architect-professional',
      'devops-professional': 'devops-professional',
      'security-specialty': 'security-specialty',
      'advanced-networking-specialty': 'advanced-networking-specialty',
      'machine-learning-specialty': 'machine-learning-specialty'
    };

    const certificationInfo = {
      'cloud-practitioner': 'AWS Certified Cloud Practitioner (CLF-C02)',
      'ai-practitioner': 'AWS Certified AI Practitioner (AIF-C01)',
      'architect-associate': 'AWS Certified Solutions Architect – Associate (SAA-C03)',
      'developer-associate': 'AWS Certified Developer – Associate (DVA-C02)',
      'sysops-associate': 'AWS Certified SysOps Administrator – Associate (SOA-C02)',
      'data-engineer-associate': 'AWS Certified Data Engineer – Associate (DEA-C01)',
      'ml-engineer-associate': 'AWS Certified Machine Learning Engineer – Associate (MLA-C01)',
      'architect-professional': 'AWS Certified Solutions Architect – Professional (SAP-C02)',
      'devops-professional': 'AWS Certified DevOps Engineer – Professional (DOP-C02)',
      'security-specialty': 'AWS Certified Security – Specialty (SCS-C02)',
      'advanced-networking-specialty': 'AWS Certified Advanced Networking – Specialty (ANS-C01)',
      'machine-learning-specialty': 'AWS Certified Machine Learning – Specialty (MLS-C01)'
    };

    const certificationsByLevel = {
      all: Object.keys(certificationInfo),
      practitioner: ['cloud-practitioner', 'ai-practitioner'],
      associate: ['architect-associate', 'developer-associate', 'sysops-associate', 'data-engineer-associate', 'ml-engineer-associate'],
      professional: ['architect-professional', 'devops-professional'],
      specialty: ['security-specialty', 'advanced-networking-specialty', 'machine-learning-specialty']
    };

    const populateCertificationOptions = (levelValue, selectEl) => {
      const certKeys = certificationsByLevel[levelValue] || certificationsByLevel.all;
      selectEl.innerHTML = '<option value="all">Todas</option>';
      certKeys.forEach(certKey => {
        const option = document.createElement('option');
        option.value = certKey;
        option.textContent = certificationInfo[certKey];
        selectEl.appendChild(option);
      });
    };

    const populateDomainOptions = (cert, selectEl) => {
      const domains = cert === 'all'
        ? Array.from(new Set(Object.values(certificationDomains).flat())).sort()
        : certificationDomains[cert] || [];

      selectEl.innerHTML = '<option value="all">Todos</option>';
      domains.forEach(domainName => {
        const option = document.createElement('option');
        option.value = domainName;
        option.textContent = domainName;
        selectEl.appendChild(option);
      });
    };

    certificationSelect.addEventListener('change', () => {
      populateDomainOptions(certificationSelect.value, domainSelect);
    });

    levelSelect.addEventListener('change', () => {
      populateCertificationOptions(levelSelect.value, certificationSelect);
      populateDomainOptions('all', domainSelect);
    });

    const fcFilterLevel = document.getElementById('fc-filter-level');
    const fcFilterCertification = document.getElementById('fc-filter-certification');
    const fcFilterDomain = document.getElementById('fc-filter-domain');
    const fcFilterDifficulty = document.getElementById('fc-filter-difficulty');
    const fcFilterService = document.getElementById('fc-filter-service');

    const applyFlashcardFilters = () => {
      flashcardEngine.filter({
        level: fcFilterLevel?.value || 'all',
        certification: fcFilterCertification?.value || 'all',
        domain: fcFilterDomain?.value || 'all',
        difficulty: fcFilterDifficulty?.value || 'all',
        service: fcFilterService?.value || 'all'
      });
    };

    fcFilterLevel.addEventListener('change', () => {
      populateCertificationOptions(fcFilterLevel.value, fcFilterCertification);
      populateDomainOptions('all', fcFilterDomain);
      applyFlashcardFilters();
    });

    fcFilterCertification.addEventListener('change', () => {
      populateDomainOptions(fcFilterCertification.value, fcFilterDomain);
      applyFlashcardFilters();
    });

    [fcFilterLevel, fcFilterCertification, fcFilterDomain, fcFilterDifficulty, fcFilterService].forEach((select) => {
      if (select) select.addEventListener('change', applyFlashcardFilters);
    });

    populateCertificationOptions('all', certificationSelect);
    populateDomainOptions('all', domainSelect);
    populateCertificationOptions('all', fcFilterCertification);
    populateDomainOptions('all', fcFilterDomain);
    applyFlashcardFilters();
    this.updateQuestionStats();

    document.getElementById('quiz-config-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const mode = document.getElementById('config-mode').value;
      const level = document.getElementById('config-level').value;
      const certification = document.getElementById('config-certification').value;
      const domain = document.getElementById('config-domain').value;
      const difficulty = document.getElementById('config-difficulty').value;
      const service = document.getElementById('config-service').value;
      const status = document.getElementById('config-status').value;
      const countValue = document.getElementById('config-count').value;
      const count = countValue === 'all' ? Number.MAX_SAFE_INTEGER : parseInt(countValue, 10);

      let filtered = dbManager.questions;
      const mappedCertification = certificationQuestionMap[certification] || certification;

      if (mappedCertification !== 'all') {
        filtered = filtered.filter(q => q.certificationKey === mappedCertification);
      }

      if (level !== 'all') {
        filtered = filtered.filter(q => q.levelCategory === level);
      }

      if (domain !== 'all') {
        filtered = filtered.filter(q => q.domain === domain);
      }

      if (difficulty !== 'all') {
        filtered = filtered.filter(q => q.difficulty === difficulty);
      }

      if (service !== 'all') {
        filtered = filtered.filter(q => Array.isArray(q.services) && q.services.includes(service));
      }

      if (status !== 'all') {
        filtered = filtered.filter(q => {
          const questionStatus = dbManager.getQuestionStatus(q.id);
          if (status === 'not-answered') return questionStatus === 'not-answered';
          if (status === 'answered') return questionStatus === 'answered';
          if (status === 'correct') return questionStatus === 'correct';
          if (status === 'incorrect') return questionStatus === 'incorrect';
          if (status === 'flagged') return dbManager.isQuestionFlagged(q.id);
          if (status === 'favorite') return dbManager.isQuestionFavorite(q.id);
          return true;
        });
      }

      filtered = filtered.slice(0, count);
      this.switchView('view-quiz-active');
      quizEngine.startQuiz(filtered, mode);
    });

    // Eventos do Quiz
    document.getElementById('btn-next-q').addEventListener('click', () => quizEngine.nextQuestion());
    document.getElementById('btn-prev-q').addEventListener('click', () => quizEngine.prevQuestion());
    document.getElementById('btn-finish-quiz').addEventListener('click', () => quizEngine.finishQuiz());
    document.getElementById('btnReview').addEventListener('click', () => this.toggleFlagCurrentQuestion());
    document.getElementById('btn-favorite-q').addEventListener('click', () => this.toggleFavoriteCurrentQuestion());
    document.getElementById('btn-open-review').addEventListener('click', () => {
      this.switchView('view-review');
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      const reviewNavItem = document.querySelector('.nav-item[data-target="view-review"]');
      if (reviewNavItem) reviewNavItem.classList.add('active');
    });

    // Toggle de Tema Claro/Escuro
    document.getElementById('theme-toggle').addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  }

  switchView(viewId) {
    document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));
    const activeView = document.getElementById(viewId);
    if (activeView) {
      activeView.classList.add('active');
    }

    if (viewId === 'view-dashboard') {
      renderDashboardCharts();
    }

    if (viewId === 'view-review') {
      this.renderReviewList();
    }
  }

  toggleFlagCurrentQuestion() {
    const currentQuestion = quizEngine.currentQuestions[quizEngine.currentIndex];
    if (!currentQuestion) return;

    const isFlagged = dbManager.toggleQuestionFlag(currentQuestion.id);
    this.updateFlagButton(isFlagged);
  }

  toggleFavoriteCurrentQuestion() {
    const currentQuestion = quizEngine.currentQuestions[quizEngine.currentIndex];
    if (!currentQuestion) return;

    const isFavorite = dbManager.toggleFavorite(currentQuestion.id);
    this.updateFavoriteButton(isFavorite);
  }

  updateFlagButton(isFlagged) {
    const button = document.getElementById('btnReview');
    if (!button) return;
    button.innerHTML = `${isFlagged ? '<i class="fa-solid fa-circle-check"></i> Desmarcar revisão' : '<i class="fa-solid fa-flag"></i> Marcar p/ Revisão'}`;
    button.classList.toggle('flagged', isFlagged);
    this.updateFlagCount();
  }

  updateFavoriteButton(isFavorite) {
    const button = document.getElementById('btn-favorite-q');
    if (!button) return;
    button.innerHTML = isFavorite ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';
    button.classList.toggle('favorited', isFavorite);
  }

  updateFlagCount() {
    const count = dbManager.getFlaggedQuestions().length;
    const el = document.getElementById('flagged-questions-count');
    if (el) {
      el.innerText = count;
    }
  }

  renderReviewList() {
    const reviewList = document.getElementById('review-list-container');
    if (!reviewList) return;

    const flaggedQuestions = dbManager.getFlaggedQuestions();
    if (flaggedQuestions.length === 0) {
      reviewList.innerHTML = '<p class="section-desc">Nenhuma questão marcada para revisão ainda.</p>';
      return;
    }

    reviewList.innerHTML = flaggedQuestions.map(q => `
      <article class="review-card">
        <div class="question-meta">
          <span class="badge domain-badge">${q.dominio}</span>
          <span class="badge level-badge">${q.nivel}</span>
        </div>
        <h3>${q.pergunta}</h3>
      </article>
    `).join('');
  }

  updateUserUI() {
    const userData = dbManager.getUserData();
    document.getElementById('user-level-badge').innerText = `Nível ${userData.level}`;
    document.getElementById('user-xp-text').innerText = `${userData.xp % 100} / 100 XP`;
    document.getElementById('xp-progress-fill').style.width = `${userData.xp % 100}%`;
    document.getElementById('user-streak-count').innerText = userData.streak;

    document.getElementById('stat-total-answered').innerText = userData.answeredCount;
    
    const accuracy = userData.answeredCount > 0 
      ? Math.round((userData.correctCount / userData.answeredCount) * 100) 
      : 0;
    document.getElementById('stat-accuracy').innerText = `${accuracy}%`;
  }

  updateQuestionStats(certification = 'all') {
    const certificationQuestionMap = {
      'cloud-practitioner': 'cloud-practitioner',
      'ai-practitioner': 'ai-practitioner',
      'architect-associate': 'architect-associate',
      'developer-associate': 'developer',
      'sysops-associate': 'sysops-associate',
      'data-engineer-associate': 'data-engineer-associate',
      'ml-engineer-associate': 'ml-engineer-associate',
      'architect-professional': 'architect-professional',
      'devops-professional': 'devops-professional',
      'security-specialty': 'security-specialty',
      'advanced-networking-specialty': 'advanced-networking-specialty'
    };

    const mappedCertification = certificationQuestionMap[certification] || certification;
    let count = dbManager.questions.length;

    if (mappedCertification !== 'all') {
      count = dbManager.questions.filter(q => q.certificacao === mappedCertification).length;
    }

    const questionCountElement = document.getElementById('dev-questions-count');
    if (questionCountElement) {
      questionCountElement.innerText = `${count}`;
    }
  }
}

const app = new App();