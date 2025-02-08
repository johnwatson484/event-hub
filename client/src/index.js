import crypto from 'crypto'
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import config from './config.js'

const client = new SNSClient()

async function sendMessage (message) {
  await client.send(
    new PublishCommand({
      Message: message,
      TopicArn: config.get('topic')
    })
  )
  console.log('Message sent')
}

const numberOfMessages = parseInt(process.argv[2])

if (!isNaN(numberOfMessages)) {
  for (let i = 0; i < process.argv[2]; i++) {
    await sendMessage(JSON.stringify({
      specversion: '1.0',
      type: 'com.lynxmagnus.hello',
      source: 'event-hub-client',
      subject: 'Hello, World!',
      id: crypto.randomUUID(),
      time: new Date().toISOString(),
      data: {
        increment: i
      }
    }))
  }
}
