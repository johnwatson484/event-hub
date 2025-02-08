import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import config from './config.js'

async function sendMessage (message) {
  const client = new SNSClient()
  await client.send(
    new PublishCommand({
      Message: message,
      TopicArn: config.get('topic')
    })
  )
  console.log('Message sent')
}

await sendMessage('Hello, world!')
