const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Require routes here
// const user = require('routes/api/fileName');

// body-parser middleware
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// Configure your database here.
const db = require('./config/keys').mongoURI;

// Connecting to your database
mongoose
  .connect(db, {useNewUrlParser: true})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World'));

// Using Routes Here
// app.use('/api/user', user);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client','build','index.html'));
  });
}

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server started on port ${port}`));

// Note: For mongoose connection to be established. You need to enter a valid URI in config/keys. Else this will throw an error.
