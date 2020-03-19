const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(express.static(__dirname + "/assets/"));
app.use(bodyParser.urlencoded({extended: false}));
mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post('/api/shorturl/new', (req, res) => {
  const {shortenURL} = require('./controller/urlHandler');
  shortenURL(req.body.url, (result) => {
    res.json(result);
  });
});

app.get('/api/shorturl/:key', (req, res) => {
  const { getShortURL } = require('./controller/urlHandler');
  getShortURL(req.params.key, (shortURL) => {
    if (shortURL) {
      res.redirect(shortURL);
    }
    else {
      res.json({ error: "No short URL found." });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
