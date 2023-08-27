import Joi from "joi";

const downloadFileSchema = Joi.object().keys({
  filename: Joi.string().required(),
});
const markUnsafeSchema = Joi.object().keys({
  filename: Joi.string().required(),
});


export { downloadFileSchema, markUnsafeSchema };
