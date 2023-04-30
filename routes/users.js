const users = require('express').Router();
const {
  findUser, getUsers, updateProfile, updateAvatar, getMyUser,
} = require('../controllers/users');

// возвращение всех пользователей
users.get('/', getUsers);

/* // возвращение пользователя по id
users.get('/:userId', findUser); */

// возвращает информацию о текущем пользователе
users.get('/me', getMyUser);

// обновляет профиль
users.patch('/me', updateProfile);

// обновляет аватар
users.patch('/me/avatar', updateAvatar);

module.exports = users;
