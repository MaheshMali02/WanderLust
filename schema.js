const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      'string.empty': 'Title is required',
    }),

    description: Joi.string().required().messages({
      'string.empty': 'Description is required',
    }),

    category: Joi.string()
      .required()
      .custom((value, helpers) => {
        const allowedCategories = [
          'Trending',
          'Rooms',
          'Iconic Center',
          'Iconic Cities',
          'Mountains',
          'Castles',
          'Amazing Pools',
          'Amazing Nature',
          'Camping',
          'Farms',
          'Form',
          'Arctic',
          'Domes',
          'Boats',
          'Creative Spaces',
          'Golfing',
          'Beach'
        ];

        // Normalize input: lowercase, capitalize each word
        const normalized = value
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        if (!allowedCategories.includes(normalized)) {
          return helpers.error('any.only'); // triggers 'Invalid category selected'
        }

        return normalized; // normalized category returned for downstream use
      })
      .messages({
        'any.only': 'Invalid category selected',
        'string.empty': 'Category is required',
      }),

    location: Joi.string().required().messages({
      'string.empty': 'Location is required',
    }),

    country: Joi.string().required().messages({
      'string.empty': 'Country is required',
    }),

    price: Joi.number().required().min(0).messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be at least 0',
      'any.required': 'Price is required',
    }),

    image: Joi.object({
      url: Joi.string().uri().required(),
      filename: Joi.string().required(),
    }).optional(),
  }).required(),
});


// Review Schema Validation
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5',
      'any.required': 'Rating is required',
    }),
    comment: Joi.string().required().messages({
      'string.empty': 'Comment is required',
    }),
  }).required(),
});
