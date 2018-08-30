var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Hospital Schema
var hospitalSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    img: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    collection: 'hospitals'
});

module.exports = mongoose.model('Hospital', hospitalSchema);