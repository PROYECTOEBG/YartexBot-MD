import fs from 'fs'
import fetch from 'node-fetch'
import jimp from 'jimp'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import moment from 'moment-timezone'
import { join, dirname } from 'path'
import ct from 'countries-and-timezones'
import { parsePhoneNumber } from 'libphonenumber-js'

let handler = async (m, { conn, usedPrefix: _p, text, command }) => {
let editMenu = global.db.data.chats[m.chat].editMenu
let fechaMoment, formatDate, nombreLugar, ciudad = null
const phoneNumber = '+' + m.sender
const parsedPhoneNumber = parsePhoneNumber(phoneNumber)
const countryCode = parsedPhoneNumber.country
const countryData = ct.getCountry(countryCode)
const timezones = countryData.timezones
const zonaHoraria = timezones.length > 0 ? timezones[0] : 'UTC'; moment.locale('es')
let lugarMoment = moment().tz(zonaHoraria)
if (lugarMoment) { fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1)
nombreLugar = countryData.name; const partes = zonaHoraria.split('/')
ciudad = partes[partes.length - 1].replace(/_/g, ' ')
} else { 
lugarMoment = moment().tz('America/Quito')
fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1)
nombreLugar = 'America'; ciudad = 'Quito' 
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { name, author, version, description, collaborators } = require(join(__dirname, '../package.json'))

let { money, joincount } = global.db.data.users[m.sender]
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
  
let menu = `
╭・・・・☆・・・・・・☆ ・・・・
┆ ⋮ . ⋅ ˚̣- : ✧ : – ⭒ ⊹ ⭒ – : ✧ : -˚̣⋅ .
┆ ⋮ ⋅.⊹ *𐒄Ꮛ𐒐Ꮼ́ Ꮯ𐒀𐒄ᎵႱᏋᎿ𐒀* ⋅.⊹
┆ ⋮ . ⋅ ˚̣- : ✧ : – ⭒ ⊹ ⭒ – : ✧ : -˚̣⋅ .
┆ ⋮
┆ ⋮  *Usuario* ${editMenu.mencion ? `@${m.sender.split("@")[0]}` : await conn.getName(m.sender) }
┆ ⋮  *Lugar* ${nombreLugar} - ${ciudad}
┆ ⋮  *Registrados* \`\`\`${Object.values(global.db.data.users).filter(user => user.registered == true).length}/${Object.keys(global.db.data.users).length}\`\`\`
┆ ⋮  *Versión* \`${version}\`
┆ ⋮  *Menú de Audios* \`${_p}menu2\`
╰・・・・☆・・・・・・☆ ・・・・
${editMenu.dividir ? readMore : ''}
${editMenu.emoji ? '*. ⋅ᘛ⁐̤ᕐ⩺┈•༶ ℹ :･ﾟ✧:･ﾟ✧･ﾟ✧*' : '*. ⋅ᘛ⁐̤ᕐ⩺┈•༶:･ﾟ✧:･ﾟ✧･ﾟ✧*'}
*. ⋅⊰ꕤ ┆* ⭔ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈Ó𝐍 
*. ⋅⊰ꕤ ┆* ・・・・・・・・・・・


`.trim()

let contextInfo = {
mentionedJid: await conn.parseMention(menu),
isForwarded: true,
forwardingScore: 1,
forwardedNewsletterMessageInfo: {
newsletterJid: '120363302472386010@newsletter',
newsletterName: 'YartexBot-MD ✨',
serverMessageId: 100
}}

if (editMenu.imagen) {
await conn.sendMessage(m.chat, { image: { url: yartexImg.getRandom() }, caption: menu, mentions: [m.sender], contextInfo: contextInfo }, { quoted: editMenu.verificado ? fkontak : m })
} else if (editMenu.video) {
await conn.sendMessage(m.chat, { video: { url: yartexVid.getRandom() }, gifPlayback: true, caption: menu, mentions: [m.sender], contextInfo: contextInfo }, { quoted: editMenu.verificado ? fkontak : m })
} else if (editMenu.dinamico) {
const mediaFiles = [{ image: { url: yartexImg.getRandom() } }, { video: { url: yartexVid.getRandom(), gifPlayback: true } }]
let randomMedia = getRandom(mediaFiles)
await conn.sendMessage(m.chat, { ...randomMedia, caption: menu, mentions: [m.sender], contextInfo: contextInfo }, { quoted: editMenu.verificado ? fkontak : m })
} else if (editMenu.simple) {
await conn.sendMessage(m.chat, { text: menu, mentions: [m.sender], contextInfo: contextInfo }, { quoted: editMenu.verificado ? fkontak : m })
} else if (editMenu.personalizado) {
let newImg = await cropImageToSquare(editMenu.personalizado)
await conn.sendMessage(m.chat, { image: newImg, caption: menu, mentions: [m.sender], contextInfo: contextInfo }, { quoted: editMenu.verificado ? fkontak : m })
} else {
await conn.sendMessage(m.chat, { video: { url: yartexVid.getRandom() }, gifPlayback: true, caption: menu, mentions: [m.sender], contextInfo: contextInfo }, { quoted: fkontak })
}
}
//handler.command = /^(menu|menú|memu|memú|help|info|comandos|2help|menu1.2|ayuda|commands|commandos|menucompleto|allmenu|allm|m|\?)$/i
handler.command = ['help', 'menu', 'allmenu'] 
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function getRandom(array) {
return array[Math.floor(Math.random() * array.length)];
}

async function cropImageToSquare(imageUrl) {
try {
let response = await fetch(imageUrl)
if (!response.ok) {
return console.log(`Error al descargar la imagen (${response.status} ${response.statusText})`)
}
let imageBuffer = await response.buffer()
let img = await jimp.read(imageBuffer)
let width = img.getWidth()
let height = img.getHeight()
let size = Math.min(width, height)
let x = (width - size) / 2
let y = (height - size) / 2
img.crop(x, y, size, size)
let croppedBuffer = await img.getBufferAsync(jimp.MIME_PNG)
return croppedBuffer
} catch (error) {
return console.error('Error:', error)
}}
