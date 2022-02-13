const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden-error');
const Article = require('../models/articles');
const {
  articleNotFound,
  articleNotCreated,
  articleAuthError,
} = require('../errors/error-message');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      if (articles.length < 1) {
        throw new NotFoundError(articleNotFound);
      }
      return res.status(200).send({ data: articles });
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  Article.create({ ...req.body, owner: req.user._id })
    .then((article) => {
      if (!article) throw new NotFoundError(articleNotCreated);
      return res.status(201).send({ data: article });
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const id = req.params.articleId;

  Article.findById(id)
    .select('+owner')
    .orFail(new NotFoundError(articleNotFound))
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          articleAuthError,
        );
      }
      return article;
    })
    .then((article) => Article.findByIdAndDelete(article._id).orFail(
      new NotFoundError(articleNotFound),
    ))
    .then((article) => res.send({ data: article }))
    .catch(next);
};
