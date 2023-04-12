const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connecting mongo');
}).catch((err) => {
  console.log(err);
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
