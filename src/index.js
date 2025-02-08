import { ReceiveMessageCommand, DeleteMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs'
import config from './config.js'

const client = new SQSClient()

const receiveParams = {
  QueueUrl: config.get('queue'),
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ['All'],
  AttributeNames: ['SentTimestamp'],
  WaitTimeSeconds: 10,
}

async function receiveMessage () {
  const { Messages } = await client.send(
    new ReceiveMessageCommand(receiveParams)
  )
  if (Messages) {
    console.log(`Messages received: ${Messages.length}`)
    Messages.forEach((message) => {
      console.log(JSON.parse(message.Body).Message)
    })
    await client.send(
      new DeleteMessageBatchCommand({
        QueueUrl: config.get('queue'),
        Entries: Messages.map((message) => ({
          Id: message.MessageId,
          ReceiptHandle: message.ReceiptHandle,
        })),
      })
    )
  }
}

async function pollMessages () {
  try {
    await receiveMessage()
  } catch (error) {
    console.error('Error receiving messages:', error)
  }
}

// Poll messages every 5 seconds
setInterval(pollMessages, 5000)
