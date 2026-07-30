/**
 * Renderização dos Gráficos do Dashboard
 */
function renderDashboardCharts() {
  const ctxAccuracy = document.getElementById('chart-accuracy-history');
  const ctxDomain = document.getElementById('chart-domain-performance');

  if (!ctxAccuracy || !ctxDomain) return;

  const userData = dbManager.getUserData();
  const history = userData.history.slice(-5);

  // Chart 1: Histórico de Precisão
  new Chart(ctxAccuracy, {
    type: 'line',
    data: {
      labels: history.map(h => h.date) || ['Sem dados'],
      datasets: [{
        label: 'Precisão (%)',
        data: history.map(h => h.accuracy) || [0],
        borderColor: '#ff9900',
        backgroundColor: 'rgba(255, 153, 0, 0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true }
  });

  // Chart 2: Desempenho por Domínio
  new Chart(ctxDomain, {
    type: 'radar',
    data: {
      labels: ['Fundamentos', 'Desenvolvimento', 'Segurança', 'CI/CD'],
      datasets: [{
        label: 'Desempenho (%)',
        data: [85, 70, 90, 65],
        backgroundColor: 'rgba(0, 115, 187, 0.2)',
        borderColor: '#0073bb'
      }]
    },
    options: { responsive: true }
  });
}