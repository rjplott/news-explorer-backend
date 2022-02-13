const router = require('express').Router();
const authRouter = require('./auth');
const articleRouter = require('./articles');
const userRouter = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found');
const { genericNotFound } = require('../errors/error-message');

router.use('/', authRouter);
router.use(auth);
router.use('/', articleRouter);
router.use('/', userRouter);

router.get('*', (req, res, next) => {
  next(new NotFoundError(genericNotFound));
});

module.exports = router;
