import util from 'util'
import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import config from './config.js'

const receiveParams = {
  QueueUrl: config.get('queue'),
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ['All'],
  AttributeNames: ['SentTimestamp'],
  WaitTimeSeconds: 10,
}

const client = new SQSClient()

setInterval(pollMessages, 5000)

async function pollMessages () {
  try {
    await receiveMessages()
  } catch (error) {
    console.error('Error receiving messages:', error)
  }
}

async function receiveMessages () {
  const { Messages } = await client.send(
    new ReceiveMessageCommand(receiveParams)
  )
  if (Messages) {
    for (const message of Messages) {
      console.log('Message received:', util.inspect(JSON.parse(JSON.parse(message.Body).Message), false, null, true))
      await client.send(
        new DeleteMessageCommand({
          QueueUrl: config.get('queue'),
          ReceiptHandle: message.ReceiptHandle
        })
      )
    }
  }
}
