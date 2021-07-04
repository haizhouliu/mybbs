const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

module.exports =  sqlite.open({// 返回一个promise
  filename: path.join(__dirname, 'bbs.db'),
  driver: sqlite3.Database,
})
