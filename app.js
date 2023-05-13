// подключение всех библиотек
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

// логирование
const { requestLogger, errorLogger } = require('./middlewares/logger');

// подключение роутов
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const allowedCors = [
  'http://localhost:4000', "http://localhost:3000"
];

// запуск сервера с дефолтным портом 3000
const app = express();
const { PORT = 4000 } = process.env;

// подключение к базе данных mestodb
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connecting mongo');
}).catch((err) => {
  console.log(err);
});

app.use(express.json());

// CORS
app.use(function(req, res, next) {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

app.use(requestLogger);

// роут логина
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// роут регистрации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(www\.)?([\w-]+).([\w\-.~:?#@!$&'()*/+,;[\]]+)/m),
  }),
}), createUser);

// мидлвер автоматической аутентификации
app.use(auth);

// роут пользователей
app.use('/users', users);
// роут карточек
app.use('/cards', cards);

// роут несуществующей страницы
app.use(() => { throw new NotFoundError('Извините, такой страницы не существует!'); });

app.use(errorLogger);

// глобальный обработчик ошибок
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
