// alert.js
const axios = require('axios');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server running on ws://localhost:8080');

// Thresholds for alerts
const thresholds = {
  cpu: 85,
  memory: 85,
  disk: 90,
  network_in: 9000,
  network_out: 9000,
  load: 4,
  processes: 180,
  disk_read: 4500,
  disk_write: 4500,
  anomaly: 0.7
};

// Helper function to fetch metric from Prometheus
async function getMetric(metricName) {
  try {
    const response = await axios.get(`http://localhost:9090/api/v1/query`, {
      params: { query: metricName }
    });
    const value = response.data.data.result[0]?.value[1];
    return parseFloat(value) || 0;
  } catch (err) {
    console.error('Error fetching metric', metricName, err.message);
    return 0;
  }
}

async function checkMetrics() {
  const metrics = {
    cpu: await getMetric('cpu_usage_percent'),
    memory: await getMetric('memory_usage_percent'),
    disk: await getMetric('disk_usage_percent'),
    network_in: await getMetric('network_in_bytes'),
    network_out: await getMetric('network_out_bytes'),
    load: await getMetric('system_load'),
    processes: await getMetric('running_processes'),
    disk_read: await getMetric('disk_read_bytes'),
    disk_write: await getMetric('disk_write_bytes'),
    anomaly: await getMetric('anomaly_score')
  };

  const alerts = [];
  for (const [key, value] of Object.entries(metrics)) {
    if (value > thresholds[key]) alerts.push(`${key.toUpperCase()} High: ${value}`);
  }
  if (alerts.length === 0) alerts.push('All resources normal');

  const payload = { metrics, alerts, timestamp: new Date() };

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });

  console.log(`Metrics sent:`, metrics, `Alerts:`, alerts);
}

// Poll every 10 seconds to match synthetic metrics
setInterval(checkMetrics, 10000);
