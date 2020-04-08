const path = require('path')
const sfs = require('fs')
const fs = sfs.promises

async function createProjectDirectory(projectTitle) {
  try {
    sfs.statSync(`./uploads/${projectTitle}`)
  } catch (err) {
    await fs.mkdir(`./uploads/${projectTitle}`)
  }
}

async function moveImage(identifiers, file) {
  const name = identifiers.modifier ? `${identifiers.modifier}-${file.filename}` : file.filename
  const title = identifiers.title
  const newPath = `./uploads/${title}/${name}`
  await fs.rename(`./uploads/images/${file.filename}`, newPath)
  return path.resolve(newPath)
}

async function moveImages(identifiers, files) {
  return await Promise.all(files.map(async (file) => await moveImage(identifiers, file)))
}

function stringify(item) {
  return JSON.stringify(item)
}

function generateCsvString(images) {
  const header = Object.keys(images[0]).map(stringify).join(',') + '\n'

  return images.reduce(
    (acc, row) => acc + Object.values(row).map(stringify).join(',') + '\n',
    header,
  )
}

async function writeCsvToDisk(csvString, projectTitle) {
  await fs.writeFile(path.resolve(`./uploads/csv/${projectTitle}.csv`), csvString)
}

async function getRelatedFiles(title) {
  const dirPath = path.resolve(`./uploads/${title}`)
  try {
    return await fs.readdir(dirPath)
  } catch (err) {
    // suggest a similar folder
    console.log(err)
  }
}

function prepPathsForCsv(files, title) {
  return files.map((file) => {
    const filePath = path.resolve(`./uploads/${title}/${file}`)

    return {
      file,
      filePath,
      sheets: `=IMAGE("${filePath}")`,
    }
  })
}

module.exports = {
  moveImages,
  writeCsvToDisk,
  getRelatedFiles,
  prepPathsForCsv,
  generateCsvString,
  createProjectDirectory,
}
