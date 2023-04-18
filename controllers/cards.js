const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({}).then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then((data) => res.send(data))
    .catch((err) => {
      res.send(err);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
