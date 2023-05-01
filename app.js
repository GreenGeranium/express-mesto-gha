// подключение всех библиотек
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

// подключение роутов
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

// запуск сервера с дефолтным портом 3000
const app = express();
const { PORT = 3000 } = process.env;

// подключение к базе данных mestodb
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connecting mongo');
}).catch((err) => {
  console.log(err);
});

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(w{3}.)?([0-9A-Za-z-]{1,}).([A-Za-z]){1,}?([0-9A-Za-z-._~:?#@!$&'()*+,;=\/\[\]]{1,})#?/m),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

app.use(auth);

app.use('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(w{3}.)?([0-9A-Za-z-]{1,}).([A-Za-z]){1,}?([0-9A-Za-z-._~:?#@!$&'()*+,;=\/\[\]]{1,})#?/m),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), users);
app.use('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(w{3}.)?([0-9A-Za-z-]{1,}).([A-Za-z]){1,}?([0-9A-Za-z-._~:?#@!$&'()*+,;=\/\[\]]{1,})#?/m),
    owner: Joi.string().required(),
    likes: Joi.object().ref('User'),
    createdAt: Joi.date(),
  }).unknown(true),
}), cards);

app.use((req, res) => {
  res.status(404).send({ message: 'Извините, такой страницы не существует!' });
});

// глобальный обработчик ошибок
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  console.log(err); // Log the entire request object
  if (err.name === 'ValidationError') {
    const errorsList = Object.values(err.errors).map((error) => error.message);
    return res.status(400).send({ message: 'Данные не валидны', errorsList });
  } if (err.name === 'CastError') {
    return res
      .status(400)
      .send({ message: 'Некорректный идентификатор' });
  } if (err.code === 11000) {
    return res.status(409).send({ message: 'Данный профиль уже существует' });
  } return res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

// приложение слушает соединения на заданном порте
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
