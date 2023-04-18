const Card = require('../models/card');

// возвращение всех карточек
module.exports.getCards = (req, res) => {
  Card.find({}).then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then((data) => res.send(data))
    .catch((err) => {
      res.send(err);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

// удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// поставить лайк карточке
module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  ).then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// убрать лайк карточке
module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  ).then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
