const users = require('express').Router();
const {
  findUser, getUsers, updateProfile, updateAvatar, getMyUser,
} = require('../controllers/users');

// возвращение всех пользователей
users.get('/', getUsers);

users.get('/:userId', (req, res, next) => {
  const { userId } = req.params;
  if (userId === 'me') {
    // Handle request for current user
    getMyUser(req, res, next);
  } else {
    // Handle request for user by ID
    findUser(req, res, next);
  }
});

users.get('/:userId', (req, res, next) => {
  const { userId } = req.params;
  // возвращает информацию о текущем пользователе
  if (userId === 'me') {
    getMyUser(req, res, next);
  } else {
    // возвращение пользователя по id
    findUser(req, res, next);
  }
});

users.get('/me', getMyUser);

// обновляет профиль
users.patch('/me', updateProfile);

// обновляет аватар
users.patch('/me/avatar', updateAvatar);

module.exports = users;
