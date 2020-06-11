const cliProgress = require('cli-progress')
const lineByLine = require('n-readlines')

exports.command = 'validate <file>'
exports.desc = 'Validate a line-delimited JSON file'
exports.builder = {}
exports.handler = async function(argv) {
  console.log('Counting lines...')

  const lineCounter = new lineByLine(argv.file)

  let line,
    count = 0

  while ((line = lineCounter.next())) {
    count++
  }

  console.log('Validating polygons...')

  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
  bar1.start(count, 0)

  const lineReader = new lineByLine(argv.file)

  while ((line = lineReader.next())) {
    const feature = JSON.parse(line)
    const polygons =
      feature.geometry.type === 'MultiPolygon'
        ? feature.geometry.coordinates[0]
        : feature.geometry.coordinates

    polygons.forEach(polygon => {
      const firstPoint = polygon[0]
      const lastPoint = polygon[polygon.length - 1]

      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        throw ('mismatch', line)
      }
    })

    bar1.increment()
  }

  bar1.stop()

  return

  // const { username, token } = getCredentials(argv)
  //
  // const curl = new Curl()
  // const close = curl.close.bind(curl)
  //
  // const url = `https://${MAPBOX_API_HOST}/tilesets/v1/sources/${username}/${
  //   argv.source_id
  // }?${querystring.stringify({
  //   access_token: token,
  // })}`
  //
  // curl.setOpt(Curl.option.URL, url)
  // curl.setOpt(Curl.option.HTTPPOST, [{ name: 'file', file: argv.file, type: 'application/text' }])
  //
  // const makeRequest = () =>
  //   new Promise((resolve, reject) => {
  //     curl.on('end', resolve)
  //     curl.on('error', reject)
  //
  //     curl.perform()
  //   })
  //
  // await makeRequest()
  //   .then(console.log)
  //   .catch(console.log)
}
