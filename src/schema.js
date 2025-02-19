import Joi from 'joi'

const schema = Joi.object({
  specversion: Joi.string().required(),
  type: Joi.string().required(),
  source: Joi.string().required(),
  id: Joi.string().uuid().required(),
  time: Joi.date().required(),
  subject: Joi.string().default('None'),
  datacontenttype: Joi.string().default('None'),
  data: Joi.any().default({})
}).required()

export default schema
