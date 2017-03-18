const fs = require('fs')
const source_directory = process.argv[2]
const target_directory = process.argv[3]
const NOT_WANTED = ['node_modules','.tmp', '.DS_Store']

if (source_directory && target_directory) start()

function start() {
  console.log('runing...')
  fs.readdir(source_directory, function (err, files) {
    if (err) return console.error(err);

    fs.mkdir(target_directory, function (err) {
      if (err) return console.error(err)

      filesStat(source_directory, target_directory, files)
      console.log('done.');
    })
  })
}

function filesStat(source, target, files) {
  for (let i = 0, len = files.length; i < len; ++i) {
    let name = files[i]

    fs.stat(source + name, function (err, stats) {
      if (!stats) return console.log(source + name, err)
      if (stats.isFile() && notWanted(name)) copyFile(source, target, name)
      if (stats.isDirectory() && notWanted(name)) copyDir(source, target, name)
    })
  }
}

function notWanted(name) {
  return NOT_WANTED.indexOf(name) === -1
}

function copyFile(source, target, name) {
  fs.readFile(source + name, function (err, data) {
    if (err) return console.error(err)

    fs.writeFile(target + name, data, function (err) {
      if (err) return console.error(err)
    })
  })
}

function copyDir(source, target, name) {
  fs.mkdir(target + name, function (err) {
    if (err) return console.error(err)

    fs.readdir(source + name, function (err, files) {
      if (err) return console.error(err)

      filesStat(source + name + '/', target + name + '/', files)
    })
  })
}
