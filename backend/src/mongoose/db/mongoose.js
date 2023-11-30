const mongoose = require('mongoose');

const mongoConifg = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
};

mongoose.connect('mongodb://localhost:27017/learning-app');
