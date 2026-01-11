const fs = require('fs');
const path = require('path');
const SERVERS_FILE = path.join(__dirname, '.playwright-servers.json');

module.exports = async () => {
  try {
    if (fs.existsSync(SERVERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SERVERS_FILE, 'utf8'));
      for (const [name, pid] of Object.entries(data)) {
        try {
          process.kill(pid);
          console.log(`Stopped server ${name} (pid=${pid})`);
        } catch (e) {
          console.warn(`Failed to stop ${name} (pid=${pid}):`, e.message);
        }
      }
      fs.unlinkSync(SERVERS_FILE);
    }
  } catch (e) {
    console.error('global-teardown error', e);
  }
};