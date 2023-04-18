const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({}).then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.findUser = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    res.status(400).send({ message: 'Некорректный идентификатор пользователя' });
    return;
  }
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные не валидны' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// обновляет профиль
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      console.log(req.body);
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные не валидны' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};
