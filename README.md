# Dat shared files

This module is a helper around dat to make it easier to share files
instead of directories.

When sharing, dat creates a .dat folder with metadata about the shared
files. While it is possible to create ignore lists, it is not easy to
use the same folders to share different files as different dat
links. See this
[issue](https://github.com/datproject/dat-node/issues/222) for a bit
more background. This modules solved the problem by symlinking files
into folders.

Secondly once you have shared a dat link, there is no registry that
easily keeps track of your shared files. This is the second purpose of
this module.

The database and symlinks are stored in the ~/.dat-shared-files/
folder.

The main purpose of this module is to make it easier to integrate
[dat](https://datproject.org/) with
[ssb](https://www.scuttlebutt.nz/).

See also
[ssb-dat-autoshare](https://github.com/arj03/ssb-dat-autoshare) for
more integration between these two projects.
