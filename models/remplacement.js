const mongoose = require('mongoose');
const Joi = require('joi');

const remplacementSchema = mongoose.Schema({
    remplace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nomenclature',
        required:true
    },
    remplacant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nomenclature',
        required:true
    },
    date_de_remplacement: {
        type: Date,
        default: Date.now,
    }
})

remplacementSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

remplacementSchema.set('toJSON', {
    virtuals: true,
});

remplacementSchema.methods.joiValidate = function(remplacement) { 
    var schema = Joi.object({
        remplace: Joi.any().required(),
        remplacant: Joi.any().required(),
        date_de_remplacement: Joi.date()
        // .format("YYYY-MM-DD")
        // .min(today())
        // .message('"date" cannot be earlier than today')
        // .max(tomorrow())
        // .message('"date" cannot be later than tomorrow')
        .required(),
    }).unknown();
	return schema.validate(remplacement);
}

exports.Remplacement = mongoose.model('Remplacement', remplacementSchema);
