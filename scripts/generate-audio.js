import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicAudioDir = path.resolve(__dirname, '../public/audio')

if (!fs.existsSync(publicAudioDir)) {
  fs.mkdirSync(publicAudioDir, { recursive: true })
}

// Generate a valid looping audio file for Web Development zone
// Creates public/audio/webdev-bgm.mp3 and public/audio/webdev-bgm.ogg
const targetMp3 = path.join(publicAudioDir, 'webdev-bgm.mp3')
const targetOgg = path.join(publicAudioDir, 'webdev-bgm.ogg')

// If either file doesn't exist, generate a valid audio file
console.log('[Audio Generator] Checking public/audio directory:', publicAudioDir)
