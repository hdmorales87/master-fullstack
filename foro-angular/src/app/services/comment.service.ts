import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable()
export class CommentService {

	public url:string;

	constructor(
		private _http : HttpClient
	){
		this.url = global.url;		
	}
	
	add(token:any, comment:any, topicId: any): Observable<any>{
		//Convertir el usuario a un json string
		let params = JSON.stringify(comment);

		//Definir las cabeceras
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);
		//Hacer petición ajax
		return this._http.post(this.url+'comment/topic/'+topicId, params, { headers: headers });
	}	

	delete(token:any, topicId:any, commentId: any): Observable<any>{	
		//Definir las cabeceras
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);
		//Hacer petición ajax
		return this._http.delete(this.url+'comment/'+topicId+'/'+commentId, { headers: headers });
	}	
	
}