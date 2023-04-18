const cards = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

// возвращение всех карточек
cards.get('/', getCards);

// создание карточки
cards.post('/', createCard);

// удаление карточки
cards.delete('/:cardId', deleteCard);

module.exports = cards;
