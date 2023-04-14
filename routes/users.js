const users = require('express').Router();
const User = require('../models/user');

// возвращение всех пользователей
users.get('/', (req, res) => {
  User.find({}).then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

// возвращение пользователя по id
users.get('/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

// создание нового пользователя
users.post('/', (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

module.exports = users;
