const Joi = require('joi');

module.exports = {
    createProductSchema: Joi.object({
        name: Joi.string().required(),
        isKilogram: Joi.string().required(),
        weight: Joi.number().optional().empty(''),
        unit: Joi.string().optional().empty(''),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        category: Joi.string().required(),
        description: Joi.string()
    }),
    editProductSchema: Joi.object({
        name: Joi.string().required(),
        weight: Joi.number().optional().empty(''),
        unit: Joi.string().optional().empty(''),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        category: Joi.string().required(),
        description: Joi.string()
    })
}