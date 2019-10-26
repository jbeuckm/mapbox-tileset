const { request } = require('https')
const { MAPBOX_API_HOST } = require('../../constants.json')
const getCredentials = require('../../getCredentials')
const querystring = require('querystring')

exports.command = 'delete <source_id>'
exports.desc = 'Delete a tileset source'
exports.builder = {}
exports.handler = function(argv) {
  const { username, token } = getCredentials(argv)

  const req = request(
    {
      host: MAPBOX_API_HOST,
      path: `/tilesets/v1/sources/${username}/${argv.source_id}?${querystring.stringify({
        access_token: token,
      })}`,
      method: 'DELETE',
    },
    response => {
      console.log(response.statusCode) // 200
    }
  )

  req.on('error', e => {
    console.error(e)
  })

  req.end()
}
