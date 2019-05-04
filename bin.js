#! /usr/bin/env node

var lib = require('./index.js')

var program = require('commander')

program
  .version(require('./package.json').version, '-v, --version')

program
  .command('share-files [paths...]')
  .description('Share files, returning the generated dat link')
  .action((files) => {
    lib.shareFiles(files, (err, datLink) => {
      if (err) console.error(err)
      else console.log(datLink)
    })
  })

program
  .command('dat-link [link]').
  description('Look up dat link and return local path if shared')
  .action((datLink) => {
    lib.datLink(datLink, (err, path) => {
      if (err) console.error(err)
      else console.log(JSON.stringify(path))
    })
  })

program
  .command('list-links')
  .description('List all links in database')
  .action(() => {
    lib.listLinks((err, links) => {
      if (err) console.error(err)
      else links.forEach(link => console.log(link))
    })
  })

program
  .command('remove-link [link]')
  .description('Remove a dat link from database')
  .action((removeLink) => {
    lib.removeLink(removeLink, (err) => {
      if (err) console.error(err)
    })
  })

program
  .command('share-all')
  .description('Share all files in database')
  .action(() => {
    lib.shareAll((err, links) => {
      if (err) console.error(err)
      else links.forEach(link => console.log('Sharing: ' + link))
    })
  })

program.parse(process.argv)
