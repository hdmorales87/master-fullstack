import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Video } from '../../models/video';

@Component({
	selector: 'app-video-detail',
	templateUrl: './video-detail.component.html',
	styleUrls: ['./video-detail.component.css'],
	providers: [UserService, VideoService]
})

export class VideoDetailComponent implements OnInit {
  	
	public identity: any;
	public token: any;
	public video: Video;	

	constructor(
		private _userService: UserService,
		private _videoService: VideoService,
		private _router: Router,
		private _route: ActivatedRoute,
		private _sanitizer: DomSanitizer
	){ 				
		this.identity = this._userService.getIdentity();    
        this.token = this._userService.getToken();  
        this.video = new Video(1, this.identity.sub, '', '', '', '', null, null);      
	}

	ngOnInit(): void {
		this.getVideo();
	}

	getVideo(){
		this._route.params.subscribe(params => {
			var id = +params['id'];

			this._videoService.getVideo(this.token, id).subscribe(
				response => {
					if(response.status == 'success'){
						this.video = response.video;						
					}
					else{
						this._router.navigate(['/inicio']);
					}
				},
				error => {
					console.log(error);				
				}
			);
		});
	}

	getVideoIframe(url) {
	    var video, results;
	 
	    if (url === null) {
	        return '';
	    }
	    results = url.match('[\\?&]v=([^&#]*)');
	    video   = (results === null) ? url : results[1];
	 
	    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
	}
}