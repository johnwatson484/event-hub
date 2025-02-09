import { receiveMessages } from './messaging.js'
import config from './config.js'

setInterval(pollMessages, config.get('message.pollingInterval'))

async function pollMessages () {
  try {
    await receiveMessages()
  } catch (error) {
    console.error('Error receiving messages:', error)
  }
}
