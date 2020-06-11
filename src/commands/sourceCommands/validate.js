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
  let pos = 0

  while ((line = lineReader.next())) {
    const feature = JSON.parse(line)

    const reportProblem = errorString => {
      bar1.stop()
      console.log(feature)
      console.log(errorString)
      process.exit()
    }

    if (feature.geometry.type === 'Point') {
      const pt = feature.geometry.coordinates
      if (isNaN(pt[0]) || isNaN(pt[1])) {
        reportProblem(`Line ${pos} is not a point!`)
      }
    }

    const polygons =
      feature.geometry.type === 'MultiPolygon'
        ? feature.geometry.coordinates[0]
        : feature.geometry.coordinates

    polygons.forEach((polygon, polygonIndex) => {
      const firstPoint = polygon[0]
      const lastPoint = polygon[polygon.length - 1]

      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        reportProblem(`Line ${pos} Polygon #${polygonIndex} is not closed!`)
      }

      for (let i = 0, l = polygon.length - 1; i < l; i++) {
        const pt = polygon[i]
        if (pt.length !== 2) {
          reportProblem(`Line ${pos} Polygon #${polygonIndex} includes a bad point!`)
        }
        if (isNaN(pt[0]) || isNaN(pt[1])) {
          reportProblem(`Line ${pos} Polygon #${polygonIndex} includes isNaN!`)
        }
      }

      for (let i = 0, l = polygon.length - 2; i < l; i++) {
        const p1 = polygon[i]
        const p2 = polygon[i + 1]

        if (p1[0] === p2[0] && p1[1] === p2[1]) {
          reportProblem(`Line ${pos} Polygon #${polygonIndex} repeats a point!`)
        }
      }

      for (let i = 1, l = polygon.length - 2; i < l; i++) {
        const p1 = polygon[i]
        for (let j = i + 1, k = polygon.length - 1; j < k; j++) {
          const p2 = polygon[j]

          if (p1[0] === p2[0] && p1[1] === p2[1]) {
            reportProblem(
              `Line ${pos} Polygon #${polygonIndex} repeats point ${p1} at position ${i}!`
            )
          }
        }
      }
    })

    bar1.increment()
    pos++
  }

  bar1.stop()

  return
}
