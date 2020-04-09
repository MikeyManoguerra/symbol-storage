const express = require('express')

const router = express.Router()
const bodyParser = require('body-parser')

const upload = require('./multerConfig')
const {
  moveImages,
  writeCsvToDisk,
  getRelatedFiles,
  prepPathsForCsv,
  generateCsvString,
  createProjectDirectory,
} = require('./util')

router.post('/upload', upload.array('photos'), async (req, res, next) => {
  try {
    const { title, modifier } = req.body
    const cleanTitle = title.trim().toLowerCase()
    const identifiers = {
      title: cleanTitle,
      modifier: modifier.trim().toLowerCase(),
    }

    if (!req.files.length) {
      throw new Error('Missing Files?')
    }

    if (!cleanTitle) {
      throw new Error('Include a job code with your upload')
    }

    await createProjectDirectory(cleanTitle)
    const movedImages = await moveImages(identifiers, req.files)

    const totalFiles = await getRelatedFiles(cleanTitle)

    res.json({ success: movedImages.length, total: totalFiles.length })
  } catch (err) {
    next(err)
  }
})

router.get('/uploads/:project/:file', async (req, res, next) => {
  try {
    const { project, file } = req.params
    res.sendFile(`${__dirname}/uploads/${project}/${file}`)
  } catch (err) {
    next(new Error('not found'))
  }
})

router.post('/generate', bodyParser.json(), async (req, res, next) => {
  try {
    const { title } = req.body
    const cleanTitle = title.trim().toLowerCase()

    if (!title) {
      throw new Error('Include the job code for the csv you want to generate')
    }

    const files = await getRelatedFiles(cleanTitle)
    const prepped = prepPathsForCsv(files, cleanTitle)
    const csvString = generateCsvString(prepped)
    await writeCsvToDisk(csvString, cleanTitle)
    res.download(`./uploads/csv/${cleanTitle}.csv`)
  } catch (err) {
    next(err)
  }
})

module.exports = router
