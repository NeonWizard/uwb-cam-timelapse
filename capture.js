// capture.js
// Captures a single image from the camera and saves to the folder for the day

const fs = require('fs')
const path = require('path')
const axios = require('axios')

async function downloadImage () {
  console.log("SAY CHEESE!")
  const url = 'http://69.91.192.220/netcam.jpg'
  const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' }).replaceAll('/', '-')
  const todays_folder = path.resolve(__dirname, 'images', today)
  const file_path = path.resolve(todays_folder, `${Date.now()}.jpg`)
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
    writer.on('finish', () => fs.chmod(file_path, 0o777, resolve))
    writer.on('error', reject)
  })
}

downloadImage()
// setInterval(downloadImage, 1000 * 60) // for dev testing