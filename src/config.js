import convict from 'convict'
import convictFormatWithValidator from 'convict-format-with-validator'

convict.addFormats(convictFormatWithValidator)

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  isDev: {
    doc: 'True if the application is in development mode.',
    format: Boolean,
    default: process.env.NODE_ENV === 'development',
  },
  message: {
    topic: {
      doc: 'AWS SNS topic ARN.',
      format: String,
      env: 'AWS_SNS_TOPIC_ARN',
      default: ''
    },
    queue: {
      doc: 'AWS SQS queue URL.',
      format: String,
      env: 'AWS_SQS_QUEUE_URL',
      default: ''
    },
  },
  db: {
    host: {
      doc: 'MongoDB host',
      format: String,
      env: 'MONGODB_HOST',
      default: ''
    },
    port: {
      doc: 'MongoDB port',
      format: 'port',
      env: 'MONGODB_PORT',
      default: 27017
    },
    user: {
      doc: 'MongoDB user',
      format: String,
      env: 'MONGODB_USER',
      default: ''
    },
    password: {
      doc: 'MongoDB password',
      format: String,
      env: 'MONGODB_PASSWORD',
      default: ''
    },
    database: {
      doc: 'MongoDB database',
      format: String,
      env: 'MONGODB_DATABASE',
      default: 'events'
    },
  }
})

config.validate({ allowed: 'strict' })

export default config
