import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';

@Component({
  	selector: 'app-home',
  	templateUrl: './home.component.html',
 	styleUrls: ['./home.component.css'],
  	providers: [UserService, VideoService]
})
export class HomeComponent implements OnInit {

	public page_title: string;
	public identity: any;
	public token: any; 
	public videos: any;
	public page: number;
	public next_page: number;
	public prev_page: number;
	public number_pages: any;

	constructor(
		private _userService: UserService,
		private _videoService: VideoService,
		private _router: Router,
		private _route: ActivatedRoute  
	){ 
		this.page_title = "Mis Videos";
		this.number_pages = [];		
		this.page = 0;
		this.next_page = 0;
		this.prev_page = 0;		
	}

	ngOnInit(): void {
		this.loadUser(); 
		this._route.params.subscribe(params => {
			var page = +params['page'];
			if(!page){
				page = 1;
				this.prev_page = 1;
				this.next_page = 2;
			}
			this.page = page;
			this.getVideos(page);
		});				
	}

	loadUser(){
        this.identity = this._userService.getIdentity();    
        this.token = this._userService.getToken();
    }

    getVideos(page: any){    	
    	this._videoService.getVideos(this.token, page).subscribe(
  			response => { 
				if(response.status == 'success'){
  					this.videos = response.videos;  
  					var number_pages = [];
  					for(var i = 1; i <= response.total_pages; i++){
  						number_pages.push(i);
  					}
  					this.number_pages = number_pages;

  					if(page >= 2){
  						this.prev_page = page - 1;
  					}
  					else{
  						this.prev_page = 1;
  					}

  					if(page < response.total_pages){
  						this.next_page = page + 1;
  					}
  					else{
  						this.next_page =  response.total_pages;
  					}			  			
				}				 				
  			},
  			error => {			    
			    console.log(error);
  			}
		); 
    }

    getThumb(url: any, size = null) {

		var video, results, thumburl;

		if (url === null) {
		  return '';
		}

		results = url.match('[\\?&]v=([^&#]*)');
		video   = (results === null) ? url : results[1];

		if(size != null) {
		  thumburl = 'http://img.youtube.com/vi/' + video + '/'+ size +'.jpg';
		}else{
		  thumburl = 'http://img.youtube.com/vi/' + video + '/mqdefault.jpg';
		}

		return thumburl;	     
	}

	deleteVideo(id: any){
		this._videoService.delete(this.token, id).subscribe(
			response => { 
				this.getVideos(this.page);
			},
  			error => {			    
			    console.log(error);
  			}
		);
	}
}