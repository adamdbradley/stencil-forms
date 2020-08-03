const path = require('path');
const rimraf = require('rimraf');

rimraf(path.join(__dirname, '..', 'dist'), () => console.log('deleted'));
