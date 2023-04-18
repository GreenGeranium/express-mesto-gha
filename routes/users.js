const users = require('express').Router();
const {
  createUser, findUser, getUsers, updateProfile, updateAvatar,
} = require('../controllers/users');

// возвращение всех пользователей
users.get('/', getUsers);

// возвращение пользователя по id
users.get('/:userId', findUser);

// создание нового пользователя
users.post('/', createUser);

// обновляет профиль
users.patch('/me', updateProfile);

// обновляет аватар
users.patch('/me/avatar', updateAvatar);

module.exports = users;
