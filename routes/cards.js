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
    link: Joi.string().regex(/^https?:\/\/(www\.)?([\w-]+).([\w\-.~:?#@!$&'()*/+,;[\]]+)/m).required(),
  }),
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
