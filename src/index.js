import { ReceiveMessageCommand, DeleteMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs'
import config from './config.js'

async function receiveMessage () {
  const client = new SQSClient()
  const { Messages } = await client.send(
    new ReceiveMessageCommand({
      QueueUrl: config.get('queue'),
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      AttributeNames: ['SentTimestamp'],
      WaitTimeSeconds: 10,
    })
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

await receiveMessage()
