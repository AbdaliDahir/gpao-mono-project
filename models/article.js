const mongoose = require('mongoose');
const Joi = require('joi');

// export enum Article_type {
//     MP = 'MP',
//     PF = 'PF',
//     Piece = 'Piece',
//     SE = 'SE'
// }

const articleSchema = mongoose.Schema({
    reference: {
        type: String,
    },
    designation: {
        type: String,
    },
    type_fabrication_achat: {
        type: String,
    },
    unite_achat_stock: {
        type: String,
    },
    delai_en_semaine: {
        type: Number
    },
    prix_standard: {
        type: Number
    },
    lot_de_reapprovisionnement: {
        type: Number
    },
    stock_mini: {
        type: Number
    },
    stock_maxi: {
        type: Number
    },
    pourcentage_de_perte: {
        type: Number
    },
    inventaire: {
        type: Number
    },
    PF_ou_MP_ou_Piece_ou_SE: {
        type: String,
        default: "MP"
    }
})

articleSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

articleSchema.set('toJSON', {
    virtuals: true,
});

articleSchema.methods.joiValidate = function(article) { 
    var schema = Joi.object({
        reference: Joi.string().alphanum().required().min(4).max(10),
        designation: Joi.string().pattern(new RegExp('^[a-zA-Z0-9 ]*$')).required().max(30),
        type_fabrication_achat: Joi.string().pattern(new RegExp('^[a-zA-Z0-9. ]*$')).required().max(30),
        unite_achat_stock: Joi.string().pattern(new RegExp('^[a-zA-Z0-9 ]*$')).required().max(30),
        delai_en_semaine: Joi.number().integer().required(),
        prix_standard: Joi.number(),
        lot_de_reapprovisionnement: Joi.number().integer(),
        stock_mini: Joi.number().integer(),
        stock_maxi: Joi.number().integer(),
        pourcentage_de_perte: Joi.number(),
        inventaire: Joi.number().integer(),
        PF_ou_MP_ou_Piece_ou_SE: Joi.string().valid("MP", "PF", "Piece", "SE")
    });
	return schema.validate(article);
}

const Article = mongoose.model('Article', articleSchema);

module.exports = {
    Article
}
