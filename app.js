// подключение всех библиотек
const express = require('express');
const mongoose = require('mongoose');

// подключение роутов
const users = require('./routes/users');
const cards = require('./routes/cards');

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

app.use((req, res, next) => {
  req.user = {
    _id: '643e6de94c25534c11b5466e',
  };
  next();
});

app.use('/users', users);
app.use('/cards', cards);

// приложение слушает соединения на заданном порте
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
