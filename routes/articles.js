const articleRouter = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

articleRouter.get('/articles', getArticles);
articleRouter.post('/articles', createArticle);
articleRouter.delete('/articles/:articleId', deleteArticle);

module.exports = articleRouter;
