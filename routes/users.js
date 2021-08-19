const userRouter = require('express').Router();
const { createUser, getCurrentUser } = require('../controllers/users');

userRouter.post('/users', createUser);
userRouter.get('/users/me', getCurrentUser);

module.exports = userRouter;
