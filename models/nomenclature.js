const Joi = require('joi');
const mongoose = require('mongoose');

const nomenclatureSchema = mongoose.Schema({
    compose: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required:true
    },
    composant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required:true
    },
    quantite_de_composition: {
        type: Number
    }
})

nomenclatureSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

nomenclatureSchema.set('toJSON', {
    virtuals: true,
});

nomenclatureSchema.methods.joiValidate = function(nomenclature) { 
    var schema = Joi.object({
        compose: Joi.any().required(),
        composant: Joi.any().required(),
        quantite_de_composition: Joi.number().required(),
    }).unknown();
	return schema.validate(nomenclature);
}

exports.Nomenclature = mongoose.model('Nomenclature', nomenclatureSchema);
