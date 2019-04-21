const fs = require('fs')
const os = require('os')
const path = require('path')
const Dat = require('dat-node')

const datFilesDir = path.join(os.homedir(), '.dat-shared-files')
const symlinksDir = path.join(datFilesDir, 'symlinks')
const jsonDbFile = path.join(datFilesDir, 'db.json')

let db = null

function ensureDirExists(dir, cb) {
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, function(err){
      if (err) throw err;

      cb()
    })
  }
  else
    cb()
}

function datShareFiles(path, cb) {
  Dat(path, function (err, dat) {
    if (err) throw err
    
    var importer = dat.importFiles()
    
    importer.on('end', function() {
      dat.joinNetwork()

      cb('dat://' + dat.key.toString('hex'))
    })
  })
}

function ensureDbLoaded() {
  if (db === null) {
    if (fs.existsSync(jsonDbFile)) {
      db = JSON.parse(fs.readFileSync(jsonDbFile))
    }
    else
      db = {}
  }
}

function addLinkToDb(existingPath, symlinkDir, datLink, cb) {
  ensureDbLoaded()

  db[datLink] = {existingPath, symlinkDir}
  fs.writeFileSync(jsonDbFile, JSON.stringify(db))
  cb(datLink)
}

module.exports = {
  shareFile: function(file, cb) {
    file = path.resolve(file)

    ensureDbLoaded()

    for (var datLink in db) {
      if (db[datLink].existingPath == file)
        return datShareFiles(db[datLink].symlinkDir, cb)
    }

    // else
    ensureDirExists(datFilesDir, () => {
      ensureDirExists(symlinksDir, () => {
        let symlinkDir = path.join(symlinksDir, Date.now().toString())
        fs.mkdir(symlinkDir, function(err) {
          if (err) throw err;

          fs.symlink(file, path.join(symlinkDir, path.basename(file)), function(err) {
            if (err) throw err;

            datShareFiles(symlinkDir, (datLink) => {
              addLinkToDb(file, symlinkDir, datLink, cb)
            })
          })
        })
      })
    })
  },
  datLink: function(datLink, cb) {
    ensureDbLoaded()

    if (db[datLink])
      cb(db[datLink].existingPath)
    else
      cb('')
  },
  listLinks: function(cb) {
    ensureDbLoaded()

    cb(Object.keys(db))
  },
  removeLink: function(datLink, cb) {
    ensureDbLoaded()

    if (db[datLink]) {
      delete db[datLink]
      fs.writeFileSync(jsonDbFile, JSON.stringify(db))
    }

    cb()
  },
  shareFiles: function(cb) {
    ensureDbLoaded()

    for (var datLink in db) {
      datShareFiles(db[datLink].symlinkDir, () => {})
    }

    if (cb)
      cb(Object.keys(db))
  }
}
