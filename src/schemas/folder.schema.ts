import Joi from "joi";
const createFolderSchema = Joi.object().keys({
  name: Joi.string().required(),
  parentFoldername: Joi.string(),
});

export { createFolderSchema };
