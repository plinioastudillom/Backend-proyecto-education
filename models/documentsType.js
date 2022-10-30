const { Schema, model } = require('mongoose');

const DocumentType = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


DocumentType.methods.toJSON = function() {
    const { __v, status, _id, ...data  } = this.toObject();
    data.uid = _id;
    return data;
}


module.exports = model( 'DocumentType', DocumentType );