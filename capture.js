// capture.js
// Captures a single image from the camera and saves to the folder for the day

const fs = require('fs')
const path = require('path')
const axios = require('axios')

async function downloadImage () {
  const url = 'http://69.91.192.220/netcam.jpg'
  const todays_folder = path.resolve(__dirname, 'images', new Date().toISOString().slice(0, 10))
  const file_path = path.resolve(todays_folder, 'image.jpg')
  if (!fs.existsSync(todays_folder)) {
    fs.mkdirSync(todays_folder, { recursive: true })
  }
  const writer = fs.createWriteStream(file_path)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

downloadImage()