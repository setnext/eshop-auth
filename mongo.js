var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'mynewdb',
  });