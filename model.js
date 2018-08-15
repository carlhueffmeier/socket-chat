const Sequelize = require('sequelize');
const config = require('./config.js');

const sequelize = new Sequelize(config.database, {
  dialectOptions: {
    charset: 'utf8mb4'
  },
  define: {
    charset: 'utf8mb4',
    collation: 'utf8mb4_col'
  }
});

const Message = sequelize.define(
  'message',
  {
    author: Sequelize.STRING,
    content: Sequelize.TEXT
  },
  {
    freezeTableName: true
  }
);

// Create tables if necessary
const dbReady = Message.sync();

exports.getAllMessages = async () => {
  await dbReady;
  return Message.findAll();
};

exports.addMessage = async ({ author, content } = {}) => {
  await dbReady;
  return Message.create({
    author,
    content
  });
};
