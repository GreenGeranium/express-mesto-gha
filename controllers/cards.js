const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden-err');

// возвращение всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({}).then((data) => res.send(data))
    .catch((err) => next(err));
};

// создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      next(err);
    });
};

// удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      console.log(req.user._id);
      console.log(data.owner.toString());
      if (!data) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (!(req.user._id === data.owner.toString())) {
        throw new ForbiddenErr('Вы не можете удалить чужую карточку');
      }
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
};

// поставить лайк карточке
module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  ).then((data) => {
    if (!data) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    res.send(data);
  })
    .catch((err) => {
      next(err);
    });
};

// убрать лайк карточке
module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  ).then((data) => {
    if (!data) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    res.send(data);
  })
    .catch((err) => {
      next(err);
    });
};
