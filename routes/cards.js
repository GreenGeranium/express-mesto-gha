const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

// возвращение всех карточек
cards.get('/', getCards);

// создание карточки
cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/https?:\/\/(w{3}.)?([0-9A-Za-z-]{1,}).([A-Za-z]){1,}?([0-9A-Za-z-._~:?#@!$&'()*+,;=\/\[\]]{1,})#?/m).required(),
    owner: Joi.string(),
    likes: Joi.object().ref('User'),
    createdAt: Joi.date(),
  }).unknown(true),
}), createCard);

// удаление карточки
cards.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

// поставить лайк карточке
cards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), addLike);

// убрать лайк карточке
cards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteLike);

module.exports = cards;
