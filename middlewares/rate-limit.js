const rateLimit = require('express-rate-limit');

const handleLimit = (request, response, next, options) => {
  response.status(options.statusCode).send(options.message);
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleLimit,
});

module.exports = limiter;
