const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AlreadyExistsErr = require('../errors/already-exists');

// авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.send({ token });
  }).catch((err) => {
    next(err);
  });
};

// возвращает информацию о текущем пользователе
module.exports.getMyUser = (req, res, next) => {
  const { _id } = req.user;
  User.findOne({ _id }).then((user) => res.send(user))
    .catch(next);
};

// возвращение всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({}).then((data) => res.send(data))
    .catch(next);
};

// возвращение пользователя по id
module.exports.findUser = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
};

// создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((data) => {
        const user = {
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          email: data.email,
        };
        res.status(201).send(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new AlreadyExistsErr('Данный профиль уже существует'));
          return;
        }
        next(err);
      });
  });
};

// обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Данного профиля нет');
      }
      res.send(data);
    })
    .catch(next);
};

// обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(data);
    })
    .catch(next);
};
