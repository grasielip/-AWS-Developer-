function renderChart() {
  const canvas = document.getElementById('performance-chart');
  const ctx = canvas.getContext('2d');
  const categories = ['Compute', 'Storage', 'Messaging'];
  const values = [2, 1, 1];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px Arial';
  ctx.fillText('Desempenho', 10, 20);

  const barWidth = 50;
  const gap = 40;
  const maxValue = Math.max(...values);

  values.forEach((value, index) => {
    const x = 30 + index * (barWidth + gap);
    const height = (value / maxValue) * 150;
    const y = 180 - height;

    ctx.fillStyle = index === 0 ? '#3b82f6' : index === 1 ? '#22c55e' : '#f59e0b';
    ctx.fillRect(x, y, barWidth, height);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(categories[index], x, 200);
  });
}
