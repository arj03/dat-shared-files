const fs = require('fs')
const os = require('os')
const path = require('path')
const Dat = require('dat-node')

const datFilesDir = path.join(os.homedir(), '.dat-shared-files')
const symlinksDir = path.join(datFilesDir, 'symlinks')
const jsonDbFile = path.join(datFilesDir, 'db.json')

function ensureDirExists(dir, cb) {
  fs.access(dir, fs.constants.F_OK, (err) => {
    if (err) fs.mkdir(dir, cb) // does not exist
    else cb()
  })
}

function datShareFiles(path, cb) {
  Dat(path, function (err, dat) {
    if (err) return cb(err)
    
    var importer = dat.importFiles()
    
    importer.on('end', function() {
      dat.joinNetwork()

      cb(null, 'dat://' + dat.key.toString('hex'))
    })
  })
}

function loadDb(cb) {
  fs.access(jsonDbFile, fs.constants.R_OK, (err) => {
    if (err) return cb(null, {}) // does not exist

    fs.readFile(jsonDbFile, (err, data) => {
      if (err) return cb(err)

      cb(null, JSON.parse(data))
    })
  })
}

function addLinkToDb(db, existingPath, symlinkDir, datLink, cb) {
  db[datLink] = {existingPath, symlinkDir}
  fs.writeFile(jsonDbFile, JSON.stringify(db), (err) => {
    if (err) return cb(err)
    else cb(null, datLink)
  })
}

module.exports = {
  shareFile: function(file, cb) {
    file = path.resolve(file)

    loadDb((err, db) => {
      if (err) return cb(err)

      for (var datLink in db) {
        if (db[datLink].existingPath == file)
          return datShareFiles(db[datLink].symlinkDir, cb)
      }

      // else
      ensureDirExists(datFilesDir, (err) => {
        if (err) return cb(err)

        ensureDirExists(symlinksDir, (err) => {
          if (err) return cb(err)

          let symlinkDir = path.join(symlinksDir, Date.now().toString())
          fs.mkdir(symlinkDir, function(err) {
            if (err) return cb(err)

            fs.symlink(file, path.join(symlinkDir, path.basename(file)), function(err) {
              if (err) return cb(err)

              datShareFiles(symlinkDir, (err, datLink) => {
                if (err) return cb(err)

                addLinkToDb(db, file, symlinkDir, datLink, cb)
              })
            })
          })
        })
      })
    })
  },
  shareFiles: function(files, cb) {
    loadDb((err, db) => {
      if (err) return cb(err)

      files = files.map(file => path.resolve(file))

      for (var datLink in db) {
        if (JSON.stringify(db[datLink].existingPath) === JSON.stringify(files))
          return datShareFiles(db[datLink].symlinkDir, cb)
      }

      // else
      ensureDirExists(datFilesDir, (err) => {
        if (err) return cb(err)

        ensureDirExists(symlinksDir, (err) => {
          if (err) return cb(err)

          let symlinkDir = path.join(symlinksDir, Date.now().toString())
          fs.mkdir(symlinkDir, function(err) {
            if (err) return cb(err)

            files.forEach((file) => {
              fs.symlink(file, path.join(symlinkDir, path.basename(file)), function(err) {
                if (err) return cb(err)
              })
            })

            datShareFiles(symlinkDir, (err, datLink) => {
              if (err) return cb(err)

              addLinkToDb(db, files, symlinkDir, datLink, cb)
            })
          })
        })
      })
    })
  },
  datLink: function(datLink, cb) {
    loadDb((err, db) => {
      if (err) return cb(err)

      if (db[datLink])
        cb(null, db[datLink].existingPath)
      else
        cb('Link not found in db')
    })
  },
  listLinks: function(cb) {
    loadDb((err, db) => {
      if (err) return cb(err)

      cb(null, Object.keys(db))
    })
  },
  removeLink: function(datLink, cb) {
    loadDb((err, db) => {
      if (err) return cb(err)

      if (db[datLink]) {
        delete db[datLink]
        fs.writeFile(jsonDbFile, JSON.stringify(db), cb)
      } else
        cb()
    })
  },
  shareAll: function(cb) {
    loadDb((err, db) => {
      if (err) return cb(err)

      var countdown = Object.keys(db).length

      for (var datLink in db) {
        datShareFiles(db[datLink].symlinkDir, (err) => {
          if (--countdown == 0)
            cb(null, Object.keys(db))
        })
      }
    })
  }
}
