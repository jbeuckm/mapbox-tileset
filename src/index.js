#!/usr/bin/env node

require('dotenv').config()

require('yargs') // eslint-disable-line
  .option('username', {
    alias: 'u',
    description: 'Mapbox Username',
  })
  .option('token', {
    alias: 't',
    description: 'Mapbox Access Token',
  })
  .commandDir('commands')
  .demandCommand()
  .help().argv
