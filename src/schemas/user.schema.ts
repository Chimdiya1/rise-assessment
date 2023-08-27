import Joi from 'joi'
const createUserBodySchema = Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
})

const authUserBodySchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

export { createUserBodySchema, authUserBodySchema }
