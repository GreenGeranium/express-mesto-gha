const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

// возвращение всех карточек
cards.get('/', getCards);

// создание карточки
cards.post('/', createCard);

// удаление карточки
cards.delete('/:cardId', deleteCard);

// поставить лайк карточке
cards.put('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), addLike);

// убрать лайк карточке
cards.delete('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteLike);

module.exports = cards;
