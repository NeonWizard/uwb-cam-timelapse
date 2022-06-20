// post-tweet.js
// Generates a GIF from today's image directory and posts to twitter

const GIFEncoder = require('gifencoder')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { createCanvas, loadImage } = require('canvas')

async function generateGIF() {
  const encoder = new GIFEncoder(640, 480)
  const todays_folder = path.resolve(__dirname, 'images', new Date().toISOString().slice(0, 10))
  const file_path = path.resolve(todays_folder, 'timelapse.gif')

  encoder.createReadStream().pipe(fs.createWriteStream(file_path))
  encoder.start()
  encoder.setRepeat(0)
  encoder.setQuality(20)
  // every 5 minutes for 19 hours = 228 frames
  // 30 fps = 33.33ms
  // 228 * 0.0333 = 7.5 seconds

  encoder.setDelay(33)

  const canvas = createCanvas(640, 480)
  const ctx = canvas.getContext('2d')

  const files = glob.sync(path.resolve(todays_folder, '*.jpg'))

  for (const file of files) {
    const img = await loadImage(file)
    console.log(file)
    ctx.drawImage(img, 0, 0, 640, 480)
    encoder.addFrame(ctx)
  }

  console.log('FIN!')
  encoder.finish()

  return file_path
}

(async () => {
  generateGIF()
})().catch(e => {
  console.warn(e)
})
