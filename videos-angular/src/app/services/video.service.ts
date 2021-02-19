import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/video';
import { global } from './global';

@Injectable()
export class VideoService {

	public url:string;
	public identity:any;
	public token: any;

	constructor(
		private _http : HttpClient
	){
		this.url = global.url;		
	}	

	create(token:any, video:any): Observable<any>{		

		let json = JSON.stringify(video);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									   .set('Authorization',token);

	    return this._http.post(this.url+'video/new', params, {headers : headers});
	}	

	getVideos(token:any, page: any): Observable<any>{

		if(!page){
			page = 1;
		}

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									   .set('Authorization',token);

	    return this._http.get(this.url+'video/list?page='+page, {headers : headers});
	}

	getVideo(token:any, id:any): Observable<any>{

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									   .set('Authorization',token);

	    return this._http.get(this.url+'video/detail/'+id, {headers : headers});
	}	

	update(token:any, video:any, id:any): Observable<any>{		

		let json = JSON.stringify(video);
		let params = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									   .set('Authorization',token);

	    return this._http.put(this.url+'video/edit/'+id, params, {headers : headers});
	}

	delete(token:any, id:any): Observable<any>{	

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
									   .set('Authorization',token);

	    return this._http.delete(this.url+'video/remove/'+id, {headers : headers});
	}
}