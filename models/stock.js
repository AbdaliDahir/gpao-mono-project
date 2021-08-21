const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
  nmbr_magasin: {
    type: String,
  },
  quantity: {
      type: Number,
      required: true
  },
  periode: {
    type: Date,
    default: new Date(),
  },
  stock_type: {
    type: String,
    default: "In"
  }
})

stockSchema.methods.joiValidate = function(article) { 
  var schema = Joi.object({
    nmbr_magasin: Joi.string().alphanum().required(),
    quantity: Joi.number().integer(),
    periode: Joi.Date(),
    stock_type: Joi.string().valid("In", "Out")
  });
return schema.validate(article);
}

exports.Stock = mongoose.model('Stock', stockSchema);
