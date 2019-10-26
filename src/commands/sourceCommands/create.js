const { request } = require('https')
const { createReadStream } = require('fs')
const { MAPBOX_API_HOST } = require('../../constants.json')
const FormData = require('form-data')
const getCredentials = require('../../getCredentials')
const querystring = require('querystring')

exports.command = 'create <source_id> <file>'
exports.desc = 'Create a tileset source'
exports.builder = {}
exports.handler = function(argv) {
  const { username, token } = getCredentials(argv)

  const readStream = createReadStream(argv.file)

  const form = new FormData()
  form.append('file', readStream)

  const req = request(
    {
      host: MAPBOX_API_HOST,
      path: `/tilesets/v1/sources/${username}/${argv.source_id}?${querystring.stringify({
        access_token: token,
      })}`,
      method: 'POST',
      headers: form.getHeaders(),
    },
    response => {
      console.log(response.statusCode) // 200
    }
  )

  form.pipe(req)

  req.on('error', e => {
    console.error(e)
  })
  //  req.end()
}
