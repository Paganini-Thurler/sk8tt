const Joi = require("joi");


 module.exports.spotSchema = Joi.object({
            spot : Joi.object({
                title: Joi.string().required(),
                location: Joi.string().required(),
                description: Joi.string().required(),
                image: Joi.string().required()

            }).required()
});

module.exports.reviewSchema = Joi.object(
    {
        review : Joi.object({
            body: Joi.string().required(),
            stars: Joi.number().required().min(1).max(5)
        }).required()
    }
);