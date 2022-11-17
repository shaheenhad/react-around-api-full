const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { notFoundErr } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errors } = require('celebrate');
const cors = require('cors');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(cors());
app.options('*', cors());
app.use(requestLogger);
app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);

// app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => {
  res.status(notFoundErr).send({ message: 'Requested resource not found' });
});

app.use(errors());
app.use(errorLogger);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? 'An error has occured on the server' : message,
  });
});

app.listen(PORT);
