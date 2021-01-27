'use strict'

var secret = 'Esto_es_una_clase_supersecreta-1113624878';
var jwt = require('jwt-simple');
var moment = require('moment');

exports.authenticated = function(req, res, next){

	//comprobar si llega autorización
	if(!req.headers.authorization){
		return res.status(403).send({
			message: "La petición no tiene la cabecera de autorization"
		});
	}

	//limpiar el token y quitar comillas
	var token = req.headers.authorization.replace(/['"]+/g,'');

	try{
		//Decodificar el token
		var payload = jwt.decode(token,secret);

		//Comprobar si el token ha expirado
		if(payload.exp <= moment().unix()){
			return res.status(404).send({
				message: "El token ha expirado"
			});
		}
	}
	catch(ex){
		return res.status(404).send({
			message: "El token no es válido"
		});
	}

	//Adjuntar usuario identificado a request
	req.user = payload;	
	
	//Pasar a la acción
	next();
};