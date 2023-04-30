// схема пользователя
const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Поле "email" не является валидным',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);
