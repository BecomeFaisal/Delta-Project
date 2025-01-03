const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null).uri().optional(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        location: Joi.string().required(),
        category: Joi.string().valid('Rooms', 'Iconic Cities', 'Mountains', 'Castle', 'Pools', 'Camp', 'Hangouts', 'Farms', 'Country Side', 'Adventure', 'Landscapes', 'Landmark').required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
})