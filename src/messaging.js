import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import config from './config.js'
import { processMessage } from './process.js'

const receiveParams = {
  QueueUrl: config.get('message.queue'),
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ['All'],
  AttributeNames: ['SentTimestamp'],
  WaitTimeSeconds: 10,
}

const messageClient = new SQSClient()

async function receiveMessages () {
  const { Messages } = await messageClient.send(
    new ReceiveMessageCommand(receiveParams)
  )
  if (Messages) {
    for (const message of Messages) {
      await processMessage(message)
      await messageClient.send(
        new DeleteMessageCommand({
          QueueUrl: config.get('message.queue'),
          ReceiptHandle: message.ReceiptHandle
        })
      )
    }
  }
}

export { receiveMessages }
