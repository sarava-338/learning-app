const express = require('express');
const userRouter = require('./routers/users');
require('./mongoose/db/mongoose');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header();
    res.status().json({});
  }
  next();
});

app.use(express.json());
app.use(userRouter);

module.exports = app;
