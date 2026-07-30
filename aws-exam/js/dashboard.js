function updateDashboard() {
  document.getElementById('answered-count').textContent = appState.answeredCount;
  document.getElementById('accuracy-rate').textContent = `${Math.round((appState.correctCount / Math.max(appState.answeredCount, 1)) * 100)}%`;
  document.getElementById('reviewed-count').textContent = appState.reviewedCount;
  renderChart();
}
