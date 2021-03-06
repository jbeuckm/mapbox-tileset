const { request } = require('https')
const { MAPBOX_API_HOST } = require('../../constants.json')
const getCredentials = require('../../getCredentials')
const querystring = require('querystring')

exports.command = 'create <tileset_id> <recipe>'
exports.desc = 'Create a tileset'
exports.builder = {}
exports.handler = function(argv) {
  const { username, token } = getCredentials(argv)

  const recipe = require(process.cwd() + '/' + argv.recipe)
  const body = JSON.stringify(recipe)

  const req = request(
    {
      host: MAPBOX_API_HOST,
      path: `/tilesets/v1/${username}.${argv.tileset_id}?${querystring.stringify({
        access_token: token,
      })}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
      },
    },
    response =>
      response.on('data', data => {
        process.stdout.write(data)
      })
  )

  req.on('error', e => {
    console.error(e)
  })

  req.write(body)
  req.end()
}
