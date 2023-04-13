const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const { UnauthenticatedError } = require('../errors');

exports.register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  });
};

exports.signup = (req, res) => {
  res.send(`
  <!DOCTYPE html>
<html>
  <head>
    <title>Sign Up</title>
    <style>
      /* Add some styles to the form elements */
      input[type="email"],
      input[type="password"],
      input[type="text"] {
        display: block;
        margin: 10px 0;
        padding: 10px;
        width: 100%;
        border-radius: 5px;
        border: 1px solid #ccc;
        font-size: 16px;
      }
      input[type="submit"] {
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
      }
      input[type="submit"]:hover {
        background-color: #3e8e41;
      }
    </style>
  </head>
  <body>
    <h1>Sign Up</h1>
    <form method="POST" action="/register">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required />

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required />

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required />

      <input type="submit" value="Sign Up" />
    </form>
  </body>
</html>

  `);
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
    },
    token,
  });
};
