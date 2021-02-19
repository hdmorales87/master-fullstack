import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { global } from './global';

@Injectable()
export class UserService {

	public url:string;
	public identity:any;
	public token: any;

	constructor(
		private _http : HttpClient
	){
		this.url = global.url;		
	}

	prueba(){
		return "hola mundo desde un servicio";
	}

	register(user:any): Observable<any>{
		//Convertir el usuario a un json string
		let json = JSON.stringify(user);
		let params = 'json='+json;

		//Definir las cabeceras
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

		//Hacer petición ajax
		return this._http.post(this.url+'registro', params, { headers: headers });
	}

	signup(user:any, getToken:any = null): Observable<any>{
		//comprobar si llega el webtoken
		if(getToken != null){
			user.getToken = getToken;
		}

		//Convertir el usuario a un json string
		let json = JSON.stringify(user);
		let params = 'json='+json;

		//Definir las cabeceras
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

		//Hacer petición ajax
		return this._http.post(this.url+'login', params, { headers: headers });
	}

	update(token:any, user:any): Observable<any>{		

		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									   .set('Authorization',token);

	    return this._http.put(this.url+'user/edit',params,{headers : headers});
	}

	getIdentity(){
		//obtener la identidad del JSON
		let identity = JSON.parse(localStorage.getItem('identity') || '"undefined"');

		if(identity && identity != "undefined" && identity != null && identity != undefined){
			this.identity = identity;
		}
		else{
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');

		if(token && token != "undefined" && token != null && token != undefined){
			this.token = token;
		}
		else{
			this.token = null;
		}

		return this.token;
	}
}