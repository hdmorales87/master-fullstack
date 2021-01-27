'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

//Modelo de COMMENT
var CommentSchema = Schema({
	content: String,
	date: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User' }
});

var Comment = mongoose.model('Comment', CommentSchema);

//Modelo de Topic
var TopicSchema = Schema({
	title: String,
	content: String,
	code: String,
	lang: String,
	date: { type: Date, default: Date.now },
	user: { type: Schema.ObjectId, ref: 'User' },
	comments: [CommentSchema]
});

//Cargar paginación
TopicSchema.plugin(mongoosePaginate);

//Esto hace lowercase y pluraliza el nombre
//User -> users -> documentos(schema);
module.exports = mongoose.model('Topic', TopicSchema);