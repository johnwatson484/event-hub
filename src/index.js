import util from 'util'
import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { MongoClient } from 'mongodb'
import config from './config.js'

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
      const messageContent = JSON.parse(JSON.parse(message.Body).Message)
      console.log('Message received:', util.inspect(messageContent), false, null, true)
      await mongoCollection.insertOne(messageContent)
      await messageClient.send(
        new DeleteMessageCommand({
          QueueUrl: config.get('message.queue'),
          ReceiptHandle: message.ReceiptHandle
        })
      )
    }
  }
}
