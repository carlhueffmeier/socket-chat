const mysql = require('mysql');
const SQL = {
  CREATE_MESSAGE_TABLE: `CREATE TABLE if not exists messages(
    message_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    author VARCHAR(30) NOT NULL,
    message VARCHAR(500) NOT NULL
  );`,
  INSERT_MESSAGE: `INSERT INTO 
  messages(author, message) VALUE(?, ?);`,
  ALL_MESSAGES: `SELECT author, message FROM messages;`
};

const pool = mysql.createPool({
  connectionLimit: 10,
  ...require('./config.js').mySqlConnectionSettings
});

pool.query(SQL.CREATE_MESSAGE_TABLE, err => {
  if (err) throw err;
});

exports.getAllMessages = () => {
  return new Promise((resolve, reject) => {
    pool.query(SQL.ALL_MESSAGES, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.addMessage = ({ author, message } = {}) => {
  return new Promise((resolve, reject) => {
    pool.query(SQL.INSERT_MESSAGE, [author, message], err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
