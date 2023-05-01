const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  findUser, getUsers, updateProfile, updateAvatar, getMyUser,
} = require('../controllers/users');

// возвращение всех пользователей
users.get('/', getUsers);

users.get('/:userId', (req, res, next) => {
  const { userId } = req.params;
  // возвращает информацию о текущем пользователе
  if (userId === 'me') {
    getMyUser(req, res, next);
  } else {
    // возвращение пользователя по id
    celebrate({
      params: Joi.object().keys({
        userId: Joi.string().alphanum().length(24),
      }),
    }).findUser(req, res, next);
  }
});

// обновляет профиль
users.patch('/me', updateProfile);

// обновляет аватар
users.patch('/me/avatar', updateAvatar);

module.exports = users;
