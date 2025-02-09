import util from 'util'
import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { MongoClient } from 'mongodb'
import config from './config.js'
import schema from './schema.js'

const receiveParams = {
  QueueUrl: config.get('message.queue'),
  MaxNumberOfMessages: 10,
  MessageAttributeNames: ['All'],
  AttributeNames: ['SentTimestamp'],
  WaitTimeSeconds: 10,
}

const messageClient = new SQSClient()

const mongoClient = new MongoClient(`${config.get('db.uri')}}?retryWrites=true&w=majority`)
await mongoClient.connect()
const mongoCollection = mongoClient.db('event-hub').collection('events')

setInterval(pollMessages, 5000)

async function pollMessages () {
  try {
    await receiveMessages()
  } catch (error) {
    console.error('Error receiving messages:', error)
  }
}

async function receiveMessages () {
  const { Messages } = await messageClient.send(
    new ReceiveMessageCommand(receiveParams)
  )
  if (Messages) {
    for (const message of Messages) {
      const event = JSON.parse(JSON.parse(message.Body).Message)
      console.log('Message received:', util.inspect(event, false, null, true))

      if (isEventValid(event)) {
        await mongoCollection.insertOne(event)
        console.log('Event saved to MongoDB')
      }

      await messageClient.send(
        new DeleteMessageCommand({
          QueueUrl: config.get('message.queue'),
          ReceiptHandle: message.ReceiptHandle
        })
      )
    }
  }
}

function isEventValid (event) {
  const validationResult = schema.validate(event, { abortEarly: false, allowUnknown: true })
  return !validationResult.error
}
