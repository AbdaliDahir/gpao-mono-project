const Joi = require('joi');
const mongoose = require('mongoose');

const operationSchema = mongoose.Schema({
  numero_operation: {
    type: Number,
  },
	temps_preparation: {
    type: Number,
  },
	temps_execution: {
    type: Number,
  },
	temps_transfert: {
    type: Number,
  },
	libelle_operation: {
    type: String,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    require: true
  }
})

operationSchema.methods.joiValidate = function(operation) { 
  var schema = Joi.object({
    numero_operation: Joi.number().integer().required(),
    temps_preparation: Joi.number().integer().required(),
    temps_execution: Joi.number().integer().required(),
    temps_transfert: Joi.number().integer().required(),
    libelle_operation: Joi.string().alphanum(),
    article: Joi.any()
  });
return schema.validate(operation);
}

exports.Operation = mongoose.model('Operation', operationSchema);
