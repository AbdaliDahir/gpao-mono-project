const mongoose = require('mongoose');

// export enum Remplacement_type {
//   MP = 'MP',
//   PF = 'PF',
//   Piece = 'Piece',
//   SE = 'SE'
// }

// export interface Remplacement {
//   reference: string;
//   designation: string;
//   type_fabrication_achat: string;
//   unite_achat_stock: string;
//   delai_en_semaine: number;
//   prix_standard?: number;
//   lot_de_reapprovisionnement?: number;
//   stock_mini?: number;
//   stock_maxi?: number;
//   pourcentage_de_perte?: number;
//   inventaire?: number;
//   PF_ou_MP_ou_Piece_ou_SE: Remplacement_type
// }

const remplacementSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: { 
        type: String,
    }
})

userSchema.methods.joiValidate = function(obj) {
	var Joi = require('joi');
	var schema = {
		username: Joi.types.String().min(6).max(30).required(),
		password: Joi.types.String().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).required(),
		email: Joi.types.String().email().required(),
		first_name: Joi.types.String().required(),
		last_name: Joi.types.String().required(),
		created: Joi.types.Date(),
	}
	return Joi.validate(obj, schema);
}

remplacementSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

remplacementSchema.set('toJSON', {
    virtuals: true,
});

exports.Remplacement = mongoose.model('Remplacement', remplacementSchema);
