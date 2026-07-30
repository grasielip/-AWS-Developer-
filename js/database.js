/**
 * Módulo para gerenciar carregamento de dados e persistência do progresso do usuário no LocalStorage.
 */
class DatabaseManager {
  constructor() {
    this.questions = [];
    this.storageKey = 'aws_exam_pro_user_data';
  }

  normalizeCertificationKey(cert) {
    const map = {
      'developer': 'developer-associate',
      'cloud-practitioner': 'cloud-practitioner',
      'ai-practitioner': 'ai-practitioner',
      'architect-associate': 'architect-associate',
      'sysops-associate': 'sysops-associate',
      'data-engineer-associate': 'data-engineer-associate',
      'ml-engineer-associate': 'ml-engineer-associate',
      'architect-professional': 'architect-professional',
      'devops-professional': 'devops-professional',
      'security-specialty': 'security-specialty',
      'advanced-networking-specialty': 'advanced-networking-specialty',
      'machine-learning-specialty': 'machine-learning-specialty'
    };
    return map[cert] || cert;
  }

  getCertificationLevel(certKey) {
    if (certKey === 'cloud-practitioner' || certKey === 'ai-practitioner') {
      return 'practitioner';
    }
    if (certKey.endsWith('-associate')) {
      return 'associate';
    }
    if (certKey.endsWith('-professional')) {
      return 'professional';
    }
    if (certKey.endsWith('-specialty')) {
      return 'specialty';
    }
    return 'all';
  }

  extractServices(text) {
    if (typeof text !== 'string') return [];
    const candidates = [
      'IAM', 'EC2', 'S3', 'Lambda', 'API Gateway', 'DynamoDB', 'RDS', 'VPC',
      'SNS', 'SQS', 'EventBridge', 'CloudFormation', 'CloudFront', 'Route 53',
      'ECS', 'EKS', 'Fargate', 'Elastic Beanstalk', 'Cognito', 'Secrets Manager',
      'KMS', 'CloudWatch', 'CloudTrail', 'Step Functions', 'CodeCommit',
      'CodeBuild', 'CodeDeploy', 'CodePipeline', 'X-Ray', 'ElastiCache', 'EFS',
      'EBS', 'AWS Backup', 'Organizations', 'Config', 'GuardDuty', 'Inspector',
      'WAF', 'Shield', 'Athena', 'Glue', 'Redshift', 'EMR', 'OpenSearch',
      'Bedrock', 'SageMaker'
    ];

    const normalized = text.toLowerCase();
    return Array.from(new Set(candidates.filter(service => normalized.includes(service.toLowerCase()))));
  }

  async loadQuestions() {
    try {
      const response = await fetch('data/developer.json');
      const rawQuestions = await response.json();
      this.questions = rawQuestions.map((item) => {
        const certificationKey = this.normalizeCertificationKey(item.certificacao || item.certification || 'developer');
        const difficulty = item.nivel || item.dificuldade || item.difficulty || '';
        const text = [item.pergunta, item.explicacao, ...(item.alternativas || [])].join(' ');
        return {
          ...item,
          certificationKey,
          levelCategory: this.getCertificationLevel(certificationKey),
          domain: item.dominio || item.category || '',
          difficulty,
          services: this.extractServices(text)
        };
      });
      return this.questions;
    } catch (error) {
      console.error('Erro ao carregar banco de questões:', error);
      return [];
    }
  }

  getUserData() {
    const defaultData = {
      xp: 0,
      level: 1,
      streak: 1,
      answeredCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      history: [],
      favorites: [],
      flagged: [],
      questionStatus: {}
    };
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return defaultData;
    }

    const parsed = JSON.parse(data);
    return {
      ...defaultData,
      ...parsed,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : defaultData.favorites,
      flagged: Array.isArray(parsed.flagged)
        ? parsed.flagged.map((id) => Number(id)).filter((id) => !Number.isNaN(id))
        : defaultData.flagged,
      history: Array.isArray(parsed.history) ? parsed.history : defaultData.history,
      questionStatus: typeof parsed.questionStatus === 'object' && parsed.questionStatus !== null
        ? parsed.questionStatus
        : defaultData.questionStatus
    };
  }

  saveUserData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getQuestionStatus(questionId) {
    const userData = this.getUserData();
    const statusMap = userData.questionStatus || {};
    return statusMap[String(questionId)] || 'not-answered';
  }

  setQuestionStatus(questionId, status) {
    const userData = this.getUserData();
    userData.questionStatus = userData.questionStatus || {};
    userData.questionStatus[String(questionId)] = status;
    this.saveUserData(userData);
  }

  toggleFavorite(questionId) {
    const userData = this.getUserData();
    userData.favorites = Array.isArray(userData.favorites) ? userData.favorites : [];
    const normalizedId = Number(questionId);
    const index = userData.favorites.indexOf(normalizedId);
    if (index >= 0) {
      userData.favorites.splice(index, 1);
    } else {
      userData.favorites.push(normalizedId);
    }
    this.saveUserData(userData);
    return userData.favorites.includes(normalizedId);
  }

  isQuestionFavorite(questionId) {
    const userData = this.getUserData();
    return Array.isArray(userData.favorites) && userData.favorites.includes(Number(questionId));
  }

  isQuestionFlagged(questionId) {
    const userData = this.getUserData();
    return userData.flagged.includes(questionId);
  }

  toggleQuestionFlag(questionId) {
    const userData = this.getUserData();
    userData.flagged = Array.isArray(userData.flagged) ? userData.flagged : [];
    const normalizedId = Number(questionId);
    const index = userData.flagged.indexOf(normalizedId);
    if (index >= 0) {
      userData.flagged.splice(index, 1);
    } else {
      userData.flagged.push(normalizedId);
    }
    this.saveUserData(userData);
    return userData.flagged.includes(normalizedId);
  }

  getFlaggedQuestions() {
    const userData = this.getUserData();
    return this.questions.filter(q => userData.flagged.includes(q.id));
  }

  addXP(points) {
    const userData = this.getUserData();
    userData.xp += points;
    userData.level = Math.floor(userData.xp / 100) + 1;
    this.saveUserData(userData);
  }
}

const dbManager = new DatabaseManager();