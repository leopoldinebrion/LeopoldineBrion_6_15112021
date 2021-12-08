const Sauce = require('../models/Sauce');
const fs = require('fs');

//créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    sauce
      .save()
      .then(() =>
        res.status(201).json({ message: 'Sauce created successfully.' })
      )
      .catch((error) => res.status(400).json({ error }));
  };

  exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({ error: error });
      }
    );
  };

//récupère une sauce et la renvoie avec son id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({ error: error });
    }
  );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

////suppression de sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.like = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    let usersLikedTemp = sauce.usersLiked;
    let usersDislikedTemp = sauce.usersDisliked;
    let likesTemp = sauce.likes;
    let dislikesTemp = sauce.dislikes;

    switch(like) {
      case 1:
        likesTemp += 1;
        usersLikedTemp.push(userId);

        break;

      case -1:
        dislikesTemp += 1;
        usersDislikedTemp.push(userId);

        break;

      case 0:
        const userAlreadyLike = usersLikedTemp.includes(userId);

        if(userAlreadyLike) {
          likesTemp -= 1;
          usersLikedTemp = usersLikedTemp.filter(uId => userId !== uId);
        } else {
          dislikesTemp -= 1;
          usersDislikedTemp = usersDislikedTemp.filter(uId => userId !== uId);
        }
        
        break
    }

    Sauce.updateOne(
      { _id: req.params.id },
      { likes: likesTemp , dislikes: dislikesTemp, usersLiked: usersLikedTemp, usersDisliked: usersDislikedTemp },
  )
    .then(() => res.status(200).json({ message: 'Likes modifié !'}))
    .catch(error => res.status(400).json({ error }));
  })
}

  /*
  switch(like) {
    //user veut liker la sauce
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {$push: { usersLiked: userId }, $inc: { likes: +1 } })
        .then(() => res.status(200).json({ message: "Like ajouté" }))
        .catch(error => res.status(400).json({ error }));

        break;

    //annule le like ou le dislike    
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          //si déjà liké
          if(sauce.usersLiked.includes(userId)) {
            Sauce.updateOne({ _id: req.params.id}, {$push: { usersLiked: userId }, $inc: { likes: -1}})
              .then(() => res.status(200).json({ message: "Like supprimé" }))
              .catch(error => res.status(400).json({ error }));
            }
          
          //si déjà dislike
          else if(sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne({ _id: req.params.id}, {$push: { usersDisliked: userId }, $inc: { dislikes: -1}})
            .then(() => res.status(200).json({ message: "Dislike supprimé" }))
            .catch(error => res.status(400).json({ error }));
          }
        })
        break

          case -1:
            Sauce.updateOne({ _id: req.params.id }, {$push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
              .then(() => res.status(200).json({ message: "Dislike ajouté" }))
              .catch(error => res.status(400).json({ error }));
      
            break;

  }
  */
