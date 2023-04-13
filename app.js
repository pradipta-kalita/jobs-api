const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
require('express-async-errors');

//custom modules
const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authenticateUser = require('./middleware/authentication');

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const app = express();
//middlewares
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

//demmy route
app.get('/', (req, res) => {
  res.send('Welcome to jobs api');
});
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const start = async () => {
  try {
    await connectDB(DB);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
