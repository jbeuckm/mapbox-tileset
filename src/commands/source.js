exports.command = 'source <command>'
exports.desc = 'Manage tileset sources'
exports.builder = function(yargs) {
  return yargs.commandDir('sourceCommands')
}
exports.handler = function(argv) {}
