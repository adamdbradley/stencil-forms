const path = require('path');
const fs = require('fs');

fs.rmdirSync(path.join(__dirname, '..', 'dist'), { recursive: true });
