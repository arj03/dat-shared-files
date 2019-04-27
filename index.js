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
  lib.shareFile(program.file, (datLink) => {
    console.log(datLink)
  })
}
else if (program.datLink)
{
  lib.datLink(program.datLink, (path) => {
    console.log(path)
  })
}
else if (program.removeLink)
{
  lib.removeLink(program.removeLink)
}
else if (program.listLinks)
{
  lib.listLinks((links) => {
    links.forEach(link => console.log(link))
  })
}
else if (program.shareFiles)
{
  lib.shareFiles(links => {
    links.forEach(link => console.log('Sharing: ' + link))
  })
}
