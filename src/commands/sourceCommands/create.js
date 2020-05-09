const { Curl } = require('node-libcurl')
const { MAPBOX_API_HOST } = require('../../constants.json')
const getCredentials = require('../../getCredentials')
const querystring = require('querystring')

exports.command = 'create <source_id> <file>'
exports.desc = 'Create a tileset source'
exports.builder = {}
exports.handler = async function(argv) {
  const { username, token } = getCredentials(argv)

  const curl = new Curl()
  const close = curl.close.bind(curl)

  const url = `https://${MAPBOX_API_HOST}/tilesets/v1/sources/${username}/${
    argv.source_id
  }?${querystring.stringify({
    access_token: token,
  })}`

  curl.setOpt(Curl.option.URL, url)
  curl.setOpt(Curl.option.HTTPPOST, [{ name: 'file', file: argv.file, type: 'application/text' }])

  const makeRequest = () =>
    new Promise((resolve, reject) => {
      curl.on('end', resolve)
      curl.on('error', reject)

      curl.perform()
    })

  await makeRequest()
    .then(console.log)
    .catch(console.log)
}
