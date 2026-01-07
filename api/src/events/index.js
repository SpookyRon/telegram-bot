module.exports = (redisClient, suscriberClient) => {
  require('./new-user.js').handleEvent(redisClient, suscriberClient)
}
