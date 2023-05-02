// подключение всех библиотек
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

// подключение роутов
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const AlreadyExistsErr = require('./errors/already-exists');

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
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(w{3}.)?([0-9A-Za-z-]{1,}).([A-Za-z]){1,}?([0-9A-Za-z-._~:?#@!$&'()*+,;=\/\[\]]{1,})#?/m),
  }),
}), createUser);

app.use(auth);

app.use('/users', users);
app.use('/cards', cards);

app.use((req, res) => NotFoundError('Извините, такой страницы не существует!'));

// глобальный обработчик ошибок
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
