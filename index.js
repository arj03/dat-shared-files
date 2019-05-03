#! /usr/bin/env node

var lib = require('./lib.js')

var program = require('commander')

program
  .version(require('./package.json').version, '-v, --version')
  .option('-f, --file [path]', 'Share a file, returning the generated dat link')
  .option('-d, --dat-link [link]', 'Look up dat link and return local path if shared')
  .option('-l, --list-links', 'List all links in database')
  .option('-r, --remove-link [link]', 'Remove a dat link from database')
  .option('-s, --share-files', 'Share all files in database')
  .parse(process.argv)

if (program.file)
{
  lib.shareFile(program.file, (err, datLink) => {
    if (err) console.error(err)
    else console.log(datLink)
  })
}
else if (program.datLink)
{
  lib.datLink(program.datLink, (err, path) => {
    if (err) console.error(err)
    else console.log(path)
  })
}
else if (program.removeLink)
{
  lib.removeLink(program.removeLink, (err) => {
    if (err) console.error(err)
  })
}
else if (program.listLinks)
{
  lib.listLinks((err, links) => {
    if (err) console.error(err)
    else links.forEach(link => console.log(link))
  })
}
else if (program.shareFiles)
{
  lib.shareFiles((err, links) => {
    if (err) console.error(err)
    else links.forEach(link => console.log('Sharing: ' + link))
  })
}
