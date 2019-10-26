module.exports = argv => ({
  username: argv.username || process.env.MAPBOX_USERNAME,
  token: argv.token || process.env.MAPBOX_TOKEN,
})
