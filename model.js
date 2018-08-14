const mysql = require('mysql');
const SQL = {
  CREATE_MESSAGE_TABLE: `CREATE TABLE if not exists messages(
    message_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    author VARCHAR(30) CHARACTER SET utf8mb4 NOT NULL,
    message VARCHAR(500) CHARACTER SET utf8mb4 NOT NULL
  );`,
  SET_ENCODING: `SET NAMES 'utf8mb4';`,
  INSERT_MESSAGE: `INSERT INTO 
  messages(author, message) VALUE(?, ?);`,
  ALL_MESSAGES: `SELECT author, message FROM messages;`
};

const pool = mysql.createPool({
  connectionLimit: 10,
  charset: 'utf8mb4',
  ...require('./config.js').mySqlConnectionSettings
});

pool.query(SQL.CREATE_MESSAGE_TABLE, err => {
  if (err) throw err;
});
pool.query(SQL.SET_ENCODING);

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
