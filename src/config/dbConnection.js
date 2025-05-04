const db = require('better-sqlite3')('dados.db', { verbose: console.log });
module.exports = db;