module.exports = (redisClient, suscriberClient) => {
  require('./new-user.js').handleEvent(redisClient, suscriberClient)
  require('./new-customer.js').handleEvent(redisClient, suscriberClient)
}
