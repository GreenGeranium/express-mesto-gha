const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({}).then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// обновляет профиль
module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: 'Виктор', about: 'Гусев' }, { new: true })
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: 'www.testupdate.com' }, { new: true })
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
