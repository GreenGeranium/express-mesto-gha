const User = require('../models/user');

// возвращение всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({}).then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// возвращение пользователя по id
module.exports.findUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Некорректный идентификатор пользователя' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// создание нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((error) => error.message);
        res.status(400).send({ message: 'Данные не валидны', errors });
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
      if (!data) {
        res.status(404).send({ message: 'Данного профиля нет' });
        return;
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((error) => error.message);
        return res.status(400).send({ message: 'Данные не валидны', errors });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный идентификатор пользователя' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Данного профиля нет' });
        return;
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((error) => error.message);
        return res.status(400).send({ message: 'Данные не валидны', errors });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный идентификатор пользователя' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
