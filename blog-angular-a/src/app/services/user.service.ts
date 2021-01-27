import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {global} from './global';

@Injectable()
export class UserService {

	public url:string;
	public identity:any;
	public token: any;

	constructor(
		private _http : HttpClient
	){
		this.url = global.url;
		this.identity = '';
		this.token = '';
	}

	test(){
		return "Hola mundo desde un servicio!";
	}

	register(user:any): Observable<any>{
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

		return this._http.post(this.url+'register',params,{headers : headers});
	}

	signup(user:any, getToken:any = null): Observable<any>{
		if(getToken != null){
			user.getToken = 'true';
		}
		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

		return this._http.post(this.url+'login',params,{headers : headers});
	}

	update(token:any,user:any): Observable<any>{
		//Limpiar campo content (editor texto enriquecido) htmlEntities > utf8
		user.description = global.htmlEntities(user.description);

		let json = JSON.stringify(user);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									   .set('Authorization',token);

	    return this._http.put(this.url+'user/update',params,{headers : headers});
	}

	getIdentity(){
		//obtener la identidad del JSON
		let identity = JSON.parse(localStorage.getItem('identity') || '"undefined"');

		if(identity && identity != "undefined"){
			this.identity = identity;
		}
		else{
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');

		if(token && token != "undefined"){
			this.token = token;
		}
		else{
			this.token = null;
		}

		return this.token;
	}

	getPosts(id:any):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

		return this._http.get(this.url+'post/user/'+id,{headers : headers});
	}

	getUser(id:any):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

		return this._http.get(this.url+'user/detail/'+id,{headers : headers});
	}
}

