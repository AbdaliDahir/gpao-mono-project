const mongoose = require('mongoose');

const remplacementSchema = mongoose.Schema({
    remplace_compose: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required:true
    },
    remplace_composant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required:true
    },
    remplacant_compose: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required:true
    },
    remplacant_composant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
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

exports.Remplacement = mongoose.model('Remplacement', remplacementSchema);
