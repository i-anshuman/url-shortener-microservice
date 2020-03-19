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

const shortenURL = (url, callback) => {
  if (!verifyURL(url)) {
    callback({error: "invalid URL"});
  }
  URLSchema.findOne({url: url}, (err, storedURL) => {
    if (err) return console.error(err);
    if (storedURL) {
      callback({ 
        original_url: storedURL.url, 
        short_url: storedURL.short,
        clicks: storedURL.clicks
      });
    }
    else {
      incrementCounter((count) => {
        const newURL = new URLSchema({
          url: url,
          short: count
        });
        newURL.save((err) => {
          if (err) return console.error(err);
          callback({ original_url: url, short_url: count });
        });
      });
    }
  });
}

const getShortURL = (short, callback) => {
  URLSchema.findOne({ short: short }, (err, shortedURL) => {
    if (err) return console.error(err);
    if (shortedURL) {
      shortedURL.clicks++;
      shortedURL.save();
      callback(shortedURL.url);
    }
    else {
      callback(null);
    }
  });
}

module.exports = {
  shortenURL,
  getShortURL
};
