const URLSchema = require('../models/urlSchema');
const URLCounter = require('../models/urlCounter');
const dns = require('dns');

const incrementCounter = (callback) => {
  URLCounter.findOneAndUpdate({}, { $inc: {count: 1 } }, (err, counter) => {
    if (err) return console.error(err);
    if (counter) {
      callback(counter.count);
    }
    else {
      const newCounter = new URLCounter();
      newCounter.save((err, counter) => {
        if (err) return console.error(err);
        URLCounter.findOneAndUpdate({}, { $inc: {count: 1 } }, (err, counter) => {
          if (err) return console.error(err);
          callback(counter.count);
        });
      });
    }
  });
}

const verifyURL = (url) => {
  //const protocol = /^http(s):$/i;
  return true;
}

const shortenURL = (url) => {
  if (!verifyURL(url)) {
    return {error: "invalid URL"};
  }
  return URLSchema.findOne({url: url}, (err, storedURL) => {
    if (err) return console.error(err);
    if (storedURL) {
      return { original_url: storedURL.url, short_url: storedURL.short };
    }
    else {
      incrementCounter((count) => {
        const newURL = new URLSchema({
          url: url,
          short: count
        });
        newURL.save((err) => {
          if (err) return console.error(err);
          return { original_url: url, short_url: count };
        });
      });
    }
  });
}

const getShortURL = (short) => {
  return URLSchema.findOne({ short: short }, (err, shortedURL) => {
    if (err) return console.error(err);
    if (shortedURL) {
      shortedURL.clicks++;
      shortedURL.save();
      //return shortedURL.url;
    }
  });
}

module.exports = {
  shortenURL,
  getShortURL
};
