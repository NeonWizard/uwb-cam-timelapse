// post-tweet.js
// Generates a GIF from today's image directory and posts to twitter

const GIFEncoder = require('gifencoder')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { createCanvas, loadImage } = require('canvas')
const { TwitterApi } = require('twitter-api-v2')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
require('dotenv').config()

const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' }).replace(/\//g, '-')
const todays_folder = path.resolve(__dirname, 'images', today)
const file_path = path.resolve(todays_folder, 'timelapse.gif')

// Compiles GIF in folder for the day, then compresses to images/timelapse.gif
// After compilation and compression, attempts posting to Twitter
async function generateGIF() {
  console.log("Generating GIF...")
  const encoder = new GIFEncoder(640, 480)

  try {
    fs.unlinkSync("images/timelapse.gif")
  } catch { }

  encoder.createReadStream().pipe(fs.createWriteStream(file_path))
  encoder.start()
  encoder.setRepeat(0)
  encoder.setQuality(20)
  // every 8 minutes for 19 hours = 152 frames
  // 24 fps = 41.66ms
  // 152 * 0.04166 = 6.3 seconds

  encoder.setDelay(41.66)

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

  await fs.promises.chmod(file_path, 0o777)

  console.log("Compressing GIF...")
  await exec(`gifsicle --colors 250 --lossy=50 -O3 -i ${file_path} >images/timelapse.gif`)

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

  try {
    const mediaId = await client.v1.uploadMedia("images/timelapse.gif")
    const { data: createdTweet } = await client.v2.tweet('', { media: { media_ids: [mediaId] } })
    console.log("finished.")
  } catch (e) {
    console.warn("Did not post tweet successfully. Error:")
    console.warn(e)
  }
}

(async () => {
  await generateGIF()
  await new Promise(r => setTimeout(r, 3000))
  await postTweet()
})().catch(e => {
  throw e
})
