// post-tweet.js
// Generates a GIF from today's image directory and posts to twitter

const GIFEncoder = require('gifencoder')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { createCanvas, loadImage } = require('canvas')
const { TwitterApi } = require('twitter-api-v2')
require('dotenv').config()

const today = new Date().toLocaleDateString('en-US', { timeZone: 'US/Pacific' }).replaceAll('/', '-')
const todays_folder = path.resolve(__dirname, 'images', today)
const file_path = path.resolve(todays_folder, 'timelapse.gif')

async function generateGIF() {
  console.log("Generating GIF...")
  const encoder = new GIFEncoder(640, 480)

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

  encoder.finish()

  fs.chmod(file_path, 0o777, ()=>{})

  console.log("finished.")
  return file_path
}

async function postTweet() {
  console.log("Posting tweet...")
  const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET_KEY,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET
  })

  const mediaId = await client.v1.uploadMedia(file_path)

  const { data: createdTweet } = await client.v2.tweet('', { media: {media_ids: [mediaId]}})

  console.log("finished.")
}

(async () => {
  await generateGIF()
  await new Promise(r => setTimeout(r, 3000))
  await postTweet()
})().catch(e => {
  throw e
})
