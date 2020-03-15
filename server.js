const express = require('express');
const app = express();
require('dotenv').config();

app.get('/', (req, res) => {
  res.send(`<h1>URL Shortener Microservice.</h1>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});