exports.command = 'tileset <command>'
exports.desc = 'Manage tilesets'
exports.builder = function(yargs) {
  return yargs.commandDir('tilesetCommands')
}
exports.handler = function(argv) {}
