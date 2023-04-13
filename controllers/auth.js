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
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }

    h1 {
      text-align: center;
      margin-top: 50px;
    }

    form {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      margin-bottom: 20px;
      font-size: 16px;
    }

      input[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 14px 20px;
        margin-top: 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

      }
      input[type="submit"]:hover {
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transform: translateY(-2px);
      }
      
      input[type="submit"]:active {
        transform: translateY(2px);
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
      }
    </style>
  </head>
  <body>
    <h1>Sign Up</h1>
    <form method="POST" action="/api/v1/auth/register">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required />

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required />

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required />

      <input type="submit" value="Sign Up" />
    </form>
    <script>
      const form = document.querySelector('form');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const response = await fetch('/api/v1/auth/register', {
          method: 'POST',
          body: formData,
        });
        console.log("Done");
      });
    </script>
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
