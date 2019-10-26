const { request } = require('https')
const { MAPBOX_API_HOST } = require('../../constants.json')
const getCredentials = require('../../getCredentials')
const querystring = require('querystring')

exports.command = 'list'
exports.desc = 'List tileset sources'
exports.builder = {}
exports.handler = function(argv) {
  const { username, token } = getCredentials(argv)

  const req = request(
    {
      host: MAPBOX_API_HOST,
      path: `/tilesets/v1/sources/${username}?${querystring.stringify({
        access_token: token,
      })}`,
      method: 'GET',
    },

    response =>
      response.on('data', data => {
        process.stdout.write(data)
      })
  )
  req.on('error', e => {
    console.error(e)
  })
  req.end()
}
