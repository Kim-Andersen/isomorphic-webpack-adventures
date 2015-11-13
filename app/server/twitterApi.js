import twitterAPI from 'node-twitter-api'

export default new twitterAPI({
  consumerKey: 'bK3fQIpXepJ05vbDMdTbcIyR8',
  consumerSecret: 'XRHSeN5N6dWFLT41BdH4yuNPB3wpcFngETV9SZbY2FcbAixwG6',
  callback: 'http://localhost:3000/auth/twitter/callback'
});