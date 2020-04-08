/*
  not being used currently
*/
function handleImages(images) {
  const results = document.getElementById('results')

  images.forEach((image) => {
    const wrapper = document.createElement('div')
    const img = document.createElement('img')
    const text = document.createElement('p')

    const src = image.gitlab.split('public')[1]
    img.src = src
    img.alt = src
    text.innerHTML = `${image.filename} <br/> ${image.sheets}`

    wrapper.appendChild(img)
    wrapper.appendChild(text)

    results.appendChild(wrapper)
  })
}

function setError(error = '') {
  document.getElementById('error').textContent = error
}

function setResults(results = '') {
  const domResults = document.getElementById('results')

  if (typeof results === 'string') {
    domResults.textContent = results
  } else {
    domResults.appendChild(results)
  }
}

function multiPartFormListener() {
  document.getElementById('multipart').addEventListener('submit', async (e) => {
    e.preventDefault()
    setError()
    setResults()

    const formData = new FormData(e.target)
    e.target.elements['photos'].value = ''

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      })

      if (!response.ok) throw await response.text()

      const { success, total } = await response.json()
      setResults(`${success} succesful uploads. ${total} total uploads for this job code`)
    } catch (err) {
      setError(err)
    }
  })
}

function generateFormListener() {
  document.getElementById('csv').addEventListener('submit', async (e) => {
    e.preventDefault()
    setError()
    setResults()

    const title = { title: e.target.elements['title'].value }
    const cleanTitle = title.title.trim().toLowerCase()

    try {
      const response = await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(title),
      })

      if (!response.ok) throw await response.text()

      // stackoverflow hack
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cleanTitle}.csv`
      a.textContent = 'download'
      document.getElementById('results').appendChild(a)
    } catch (err) {
      setError(err)
    }
  })
}

;(() => {
  multiPartFormListener()
  generateFormListener()
})()
