var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//Mongoose Schema
var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

//User Schema
var userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requrido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El E-mail es requrido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requrida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: validRoles
    }
});

// Mongoose Plugin Use
userSchema.plugin(uniqueValidator, { message: 'El campo {PATH} debe de ser único' });

module.exports = mongoose.model('User', userSchema);