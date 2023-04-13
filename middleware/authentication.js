const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    /*
    alternate approach
    const user = User.findById(payload.id).select('-password');
    req.user = user;
    */

    //attach user to the job route
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (err) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

module.exports = auth;
