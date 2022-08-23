const Redis = require("ioredis");

const redis = new Redis(`redis://:${process.env.CACHE_PASS}@${process.env.CACHE_HOST}:6379`);
module.exports = redis;