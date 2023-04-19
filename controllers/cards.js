const Card = require('../models/card');

// возвращение всех карточек
module.exports.getCards = (req, res) => {
  Card.find({}).then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((error) => error.message);
        res.status(400).send({ message: 'Данные не валидны', errors });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Данной карточки нет' });
        return;
      }
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Некорректный идентификатор карточки' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// поставить лайк карточке
module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  ).then((data) => {
    if (!data) {
      res.status(404).send({ message: 'Данной карточки нет' });
      return;
    }
    res.send(data);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Некорректный идентификатор карточки' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

// убрать лайк карточке
module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  ).then((data) => {
    if (!data) {
      res.status(404).send({ message: 'Данной карточки нет' });
      return;
    }
    res.send(data);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Некорректный идентификатор карточки' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
