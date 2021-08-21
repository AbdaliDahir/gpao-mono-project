const mongoose = require('mongoose');

// export enum Nomenclature_type {
//   MP = 'MP',
//   PF = 'PF',
//   Piece = 'Piece',
//   SE = 'SE'
// }

// export interface Nomenclature {
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
//   PF_ou_MP_ou_Piece_ou_SE: Nomenclature_type
// }

const nomenclatureSchema = mongoose.Schema({
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


nomenclatureSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

nomenclatureSchema.set('toJSON', {
    virtuals: true,
});

exports.Nomenclature = mongoose.model('Nomenclature', nomenclatureSchema);
