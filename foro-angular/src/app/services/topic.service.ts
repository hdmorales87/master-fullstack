import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable()
export class TopicService {

	public url:string;

	constructor(
		private _http : HttpClient
	){
		this.url = global.url;		
	}

	prueba(){
		return "hola mundo desde topic service";
	}

	addTopic(token:any, topic:any): Observable<any>{
		//Convertir el usuario a un json string
		let params = JSON.stringify(topic);

		//Definir las cabeceras
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);
		//Hacer petición ajax
		return this._http.post(this.url+'topic', params, { headers: headers });
	}

	getMyTopics(userId:any): Observable<any>{
		//Definir las cabeceras
		let headers = new HttpHeaders().set('Content-Type','application/json');
		//Hacer petición ajax
		return this._http.get(this.url+'user-topics/'+userId, { headers: headers });
	}

	getTopic(id:any): Observable<any>{
		return this._http.get(this.url+'topic/'+id);
	}

	update(token:any, id:any, topic:any): Observable<any>{
		//Convertir el usuario a un json string
		let params = JSON.stringify(topic);

		//Definir las cabeceras
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);
		//Hacer petición ajax
		return this._http.put(this.url+'topic/'+id, params, { headers: headers });
	}

	delete(token:any, id:any): Observable<any>{	
		//Definir las cabeceras
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);
		//Hacer petición ajax
		return this._http.delete(this.url+'topic/'+id, { headers: headers });
	}

	getTopics(page = 1): Observable<any>{		
		//Hacer petición ajax
		return this._http.get(this.url+'topics/'+page);
	}

	search(searchString: any): Observable<any>{		
		//Hacer petición ajax
		return this._http.get(this.url+'search/'+searchString);
	}
}