const mongoose = require('mongoose');
const Joi = require('joi');

const postChargeSchema = mongoose.Schema({
    numero_section: {
        type: Number,
    }, 
	numero_sous_section: {
        type: Number,
    }, 
	machine: {
        type: Number,
    }, 
	designation: {
        type: String,
    }, 
	taux_horaire_ou_forfait: {
        type: Number,
    }, 
	nombre_de_postes: {
        type: Number,
    }, 
	capacite_nominale: {
        type: Number,
    }, 
	type_taux_horaire_ou_forfait: {
        type: String
    }
})

postChargeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

postChargeSchema.set('toJSON', {
    virtuals: true,
});

postChargeSchema.methods.joiValidate = function(postCharge) { 
    var schema = Joi.object({
        numero_section: Joi.number().integer().required(),
        numero_sous_section: Joi.number().integer().required(),
        machine: Joi.number().integer().required(),
        designation: Joi.string().pattern(new RegExp('^[a-zA-Z0-9 ]*$')).required().max(30),
        taux_horaire_ou_forfait: Joi.number().integer().required(),
        nombre_de_postes: Joi.number().integer().required(),
        capacite_nominale: Joi.number().integer().required(),
        type_taux_horaire_ou_forfait: Joi.string().pattern(new RegExp('^[a-zA-Z0-9 ]*$')).required().max(2),
    }).unknown();
	return schema.validate(postCharge);
}

const PostCharge = mongoose.model('PostCharge', postChargeSchema);

module.exports = {
    PostCharge
}
