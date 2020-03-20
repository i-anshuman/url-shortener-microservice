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

const shortenURL = (url, callback) => {
  const protocolRegEx = /^https?:\/\/(.*)/i;
  const hostnameRegEx = /^([a-z0-9\-_]+\.)+[a-z0-9\-_]+/i;
  if (url.match(/\/$/i)) {
    url = url.slice(0,-1);
  }
  const protocol = url.match(protocolRegEx);
  if (!protocol) { 
    callback({error: "invalid URL"});
  }
  const hostname = protocol[1].match(hostnameRegEx);
  if (hostname) {
    dns.lookup(hostname[0], (err, adderss) => {
      if (err) {
        callback({error: "invalid URL"});
      }
      else {
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
    })
  }
  else {
    callback({error: "invalid URL"});
  }
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
