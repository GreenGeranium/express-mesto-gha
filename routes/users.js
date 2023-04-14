const users = require('express').Router();
const { createUser, findUser, getUsers } = require('../controllers/users');

// возвращение всех пользователей
users.get('/', getUsers);

// возвращение пользователя по id
users.get('/:userId', findUser);

// создание нового пользователя
users.post('/', createUser);

module.exports = users;
