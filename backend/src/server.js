import { app } from './app.js';
import { config } from './config/env.js';

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` 🚀 PeoplePay360 Express Backend API online!`);
  console.log(` 📍 Local Server: http://localhost:${PORT}`);
  console.log(` 📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
