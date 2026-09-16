import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicAudioDir = path.resolve(__dirname, '../public/audio')

if (!fs.existsSync(publicAudioDir)) {
  fs.mkdirSync(publicAudioDir, { recursive: true })
}

const targetFile = path.join(publicAudioDir, 'webdev-bgm.mp3')

// Download a royalty-free game loop from MDN Web Audio Examples
const fileUrl = 'https://raw.githubusercontent.com/mdn/webaudio-examples/main/audio-basics/outfoxing.mp3'

console.log('Downloading background music to:', targetFile)
const file = fs.createWriteStream(targetFile)

https.get(fileUrl, (response) => {
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    https.get(response.headers.location, (res2) => {
      res2.pipe(file)
      file.on('finish', () => {
        file.close()
        console.log('Download complete! Size:', fs.statSync(targetFile).size, 'bytes')
      })
    })
  } else {
    response.pipe(file)
    file.on('finish', () => {
      file.close()
      console.log('Download complete! Size:', fs.statSync(targetFile).size, 'bytes')
    })
  }
}).on('error', (err) => {
  fs.unlink(targetFile, () => {})
  console.error('Error downloading:', err.message)
})
