const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({}).then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
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
  User.findByIdAndUpdate(req.user._id, { name: 'Виктор', about: 'Гусев' }, { new: true })
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: 'www.testupdate.com' }, { new: true })
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};
