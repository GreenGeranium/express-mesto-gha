const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  findUser, getUsers, updateProfile, updateAvatar, getMyUser,
} = require('../controllers/users');

// возвращение всех пользователей
users.get('/', getUsers);

users.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.alternatives().try(Joi.string().alphanum().length(24), Joi.string().valid('me')),
  }),
}), (req, res, next) => {
  const { userId } = req.params;
  // возвращает информацию о текущем пользователе
  if (userId === 'me') {
    getMyUser(req, res, next);
  } else {
    // возвращение пользователя по id
    findUser(req, res, next);
  }
});

// обновляет профиль
users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(w{3}.)?([0-9A-Za-z-]{1,}).([A-Za-z]){1,}?([0-9A-Za-z-._~:?#@!$&'()*+,;=\/\[\]]{1,})#?/m),
  }).unknown(true),
}), updateProfile);

// обновляет аватар
users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(w{3}.)?([0-9A-Za-z-]{1,}).([A-Za-z]){1,}?([0-9A-Za-z-._~:?#@!$&'()*+,;=\/\[\]]{1,})#?/m),
  }).unknown(true),
}), updateAvatar);

module.exports = users;
