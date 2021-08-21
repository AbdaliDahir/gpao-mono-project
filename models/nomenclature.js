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

exports.Nomenclature = mongoose.model('Nomenclature', nomenclatureSchema);
