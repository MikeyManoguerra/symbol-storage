const express = require('express')
const app = express()

const formRouter = require('./routes')
const PORT = 3000

app.use(express.static('public'))

app.use('/', formRouter)

app.use((err, req, res, next) => {
  // create error codes and have a fixed set fo errors
  res.status(500).send(err.message)
})

app.listen(PORT, () => {
  console.log('Listening at ' + PORT)
})
