# Dat shared files

This module is a helper around dat to make it easier to share files
instead of directories.

When sharing, dat creates a .dat folder with metadata about the shared
files. While it is possible to create ignore lists, it is not easy to
use the same folders to share different files as different dat
links. See this
[issue](https://github.com/datproject/dat-node/issues/222) for a bit
more background.

This modules solved the problem by symlinking files into folders. In
this way the files are only stored once, but this also means that if
you intend to share the files for a longer period of time, it is
probably best to move them somewhere where they will not be deleted so
easily.

Secondly once you have shared a dat link, there is no registry that
easily keeps track of your shared files. This is the second purpose of
this module.

The database and symlinks are stored in the ~/.dat-shared-files/
folder.

The main purpose of this module is to make it easier to integrate
[dat](https://datproject.org/) with
[ssb](https://www.scuttlebutt.nz/).

## Example usage

```js
var datSharedFiles = require('dat-shared-files/lib')

var datSharedFiles.shareFile(filePath, (datLink) => {
  console.log('new dat:', datLink)
})
```

## API

### `shareFile(file, cb)`

Takes a filepath and creates a dat, adds it to local db of dats being
shared, and calls back with the datLink.

### `shareFiles(cb)`

Reads the list of all DATs made by this module, and starts sharing
them all.  Calls back with an Array of all datLinks currently
registered.

### `listLinks(cb)`

Calls back with an array of all datLinks currently registered.

### `datLink(datLink, cb)`

Calls back with the path to where the files for the named DAT are
currently stored, OR `''` if there aren't currently any

### `removeLink(datLink, cb)`

Removes the DAT from the database, meaning this DAT will not be
included in functionality like e.g. `datShareFiles`.  Callback is a
function which is given no arguments but is run when done.

## CLI

Can also be installed globally as `dat-shared-files`, where the above
functionality is available from the command line (see -h).

## See also

[ssb-dat-autoshare](https://github.com/arj03/ssb-dat-autoshare) for
more integration between dat and ssb.
