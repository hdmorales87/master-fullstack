'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	image: String,
	role: String
});

//Ocultar el password de las consultas
UserSchema.methods.toJSON = function(){
	var obj = this.toObject();
	delete obj.password;
	return obj;
}

//Esto hace lowercase y pluraliza el nombre
//User -> users -> documentos(schema);
module.exports = mongoose.model('User', UserSchema);