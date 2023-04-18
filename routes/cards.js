const cards = require('express').Router();
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
cards.put('/:cardId/likes', addLike);

// убрать лайк карточке
cards.delete('/:cardId/likes', deleteLike);

module.exports = cards;
