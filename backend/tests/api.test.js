export const runApiSmokeTest = async (port = 5000) => {
  const res = await fetch(`http://localhost:${port}/api/health`);
  const data = await res.json();
  if (data.status !== 'healthy') {
    throw new Error('Health check failed');
  }
  return true;
};
