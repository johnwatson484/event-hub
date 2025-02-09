import util from 'util'
import { MongoClient } from 'mongodb'
import config from './config.js'
import { isEventValid } from './validate.js'

const mongoClient = new MongoClient(`${config.get('db.uri')}}?retryWrites=true&w=majority`)
await mongoClient.connect()
const mongoCollection = mongoClient.db('event-hub').collection('events')

async function processMessage (message) {
  const event = JSON.parse(JSON.parse(message.Body).Message)
  console.log('Message received:', util.inspect(event, false, null, true))

  if (isEventValid(event)) {
    await mongoCollection.insertOne(event)
    console.log('Event saved to MongoDB')
  }
}

export { processMessage }
