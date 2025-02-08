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
  endpoint: {
    doc: 'AWS endpoint URL.',
    format: String,
    env: 'AWS_ENDPOINT_URL',
    default: ''
  },
  region: {
    doc: 'AWS region.',
    format: String,
    env: 'AWS_REGION',
    default: ''
  },
  accessKey: {
    doc: 'AWS access key ID.',
    format: String,
    env: 'AWS_ACCESS_KEY_ID',
    default: ''
  },
  secretKey: {
    doc: 'AWS secret access key.',
    format: String,
    env: 'AWS_SECRET_ACCESS_KEY',
    default: ''
  },
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
})

config.validate({ allowed: 'strict' })

export default config
