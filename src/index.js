import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import { ReceiveMessageCommand, DeleteMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs'

const TOPIC_ARN = process.env.AWS_SNS_TOPIC_ARN
const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL

const credentials = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
}

async function sendMessage (message) {
  const client = new SNSClient({ region: 'eu-west-2', credentials })
  await client.send(
    new PublishCommand({
      Message: message,
      TopicArn: TOPIC_ARN,
      MessageGroupId: 'demo-group',
      MessageDeduplicationId: Date.now().toString(),
    })
  )
  console.log('Message sent')
}

async function receiveMessage () {
  const client = new SQSClient({ region: 'eu-west-2', credentials })
  const { Messages } = await client.send(
    new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
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
        QueueUrl: QUEUE_URL,
        Entries: Messages.map((message) => ({
          Id: message.MessageId,
          ReceiptHandle: message.ReceiptHandle,
        })),
      })
    )
  }
}

await sendMessage('Hello, world!')
await receiveMessage()
