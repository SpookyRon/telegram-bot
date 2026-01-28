const TelegramBot = require('node-telegram-bot-api')
const sequelizeDb = require('../../models/sequelize')

const Bot = sequelizeDb.Bot
const BotVerification = sequelizeDb.BotVerification

let started = false

function buildLoginHelp (emailExample = 'tuemail@gmail.com', codeExample = '123456') {
  return [
    'Para poder usar este bot tienes que verificarte con el comando:',
    '',
    `/login ${emailExample}:${codeExample}`,
    '',
    'Ejemplo:',
    '/login carlossedagambin@gmail.com:768390'
  ].join('\n')
}

async function handleMessage (tgBot, msg) {
  try {
    const chatId = msg.chat?.id
    const telegramUserId = String(msg.from?.id || '')
    const text = (msg.text || '').trim()

    if (!chatId || !telegramUserId) return

    // 1) Si escribe /login email:codigo -> intentamos verificar
    const loginMatch = text.match(/^\/login(?:@\w+)?\s+(.+?)\s*:\s*(\d{6})\s*$/i)
    if (loginMatch) {
      const email = loginMatch[1].trim()
      const verificationCode = loginMatch[2].trim()

      const row = await BotVerification.findOne({
        where: { email, verificationCode }
      })

      if (!row) {
        await tgBot.sendMessage(chatId, '❌ Email o código incorrectos. Revisa el correo y prueba otra vez.')
        return
      }

      // Si ya estaba asignado a OTRO telegramUserId, por seguridad no lo reasignamos
      if (row.telegramUserId && row.telegramUserId !== telegramUserId) {
        await tgBot.sendMessage(chatId, '❌ Este código ya fue usado en otra cuenta de Telegram.')
        return
      }

      await row.update({ telegramUserId })
      await tgBot.sendMessage(chatId, '✅ Verificación correcta. Ya puedes usar el bot.')
      return
    }

    // 2) Si NO es /login: comprobamos si el usuario está verificado
    const verified = await BotVerification.findOne({
      where: { telegramUserId }
    })

    if (!verified) {
      // Según el enunciado detallado: si no está verificado, respondemos siempre con el “cómo loguearse”
      await tgBot.sendMessage(chatId, buildLoginHelp())
      return
    }

    // 3) Si está verificado -> aquí iría la lógica real del bot
    // Por ahora (para comprobar que el bloqueo funciona), respondemos algo simple:
    await tgBot.sendMessage(chatId, `✅ Acceso permitido. Has dicho: ${text || '(mensaje sin texto)'}`)
  } catch (err) {
    console.error('Telegram handler error:', err)
  }
}

async function startTelegramBots () {
  if (started) return
  started = true

  const bots = await Bot.findAll({
    where: { platform: 'telegram' },
    attributes: ['id', 'name', 'token']
  })

  if (!bots.length) {
    console.log('⚠️ No hay bots con platform="telegram" en la tabla bots.')
    return
  }

  bots.forEach((b) => {
    if (!b.token) {
      console.log(`⚠️ Bot id=${b.id} sin token. Saltando...`)
      return
    }

    const tgBot = new TelegramBot(b.token, { polling: true })

    tgBot.on('polling_error', (e) => {
      console.error(`Polling error [${b.name || b.id}]:`, e?.message || e)
    })

    tgBot.on('message', (msg) => handleMessage(tgBot, msg))

    console.log(`🤖 Telegram bot arrancado: ${b.name} (id=${b.id})`)
  })
}

module.exports = startTelegramBots
