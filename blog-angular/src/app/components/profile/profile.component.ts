import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { global } from '../../services/global';

@Component({
  	selector: 'app-profile',
  	templateUrl: './profile.component.html',
  	styleUrls: ['./profile.component.css'],
  	providers: [ PostService,UserService ]
})

export class ProfileComponent implements OnInit {
  	
	  public url:string;
	  public posts:any;
	  public user: User;
	  public identity:any;
	  public token:any;

  	constructor(
  		  private _postService: PostService,
		    private _userService: UserService,
		    private _route: ActivatedRoute, 
  		  private _router: Router  	 
  	){   
        this.user = new User(1,'','','','','ROLE_USER','',''); 		
		    this.url = global.url;
		    this.identity = this._userService.getIdentity();
		    this.token = this._userService.getToken();
  	}

  	ngOnInit(): void {
  		  this.getProfile();
  	}

  	getProfile(){
    		this._route.params.subscribe(params => {
        		let userId = +params['id'];
        		this.getUser(userId);
    			  this.getPosts(userId);
    		});
  	}

  	getUser(userId:number){
    		this._userService.getUser(userId).subscribe(	
      			response => {
                if(response.status == "success"){
                    this.user = response.user; 
                }
            },
            error => {
                console.log(<any>error);
            }
      	);
  	}

  	getPosts(userId:number){
		    this._userService.getPosts(userId).subscribe(	
			      response => {
                if(response.status == "success"){
                    this.posts = response.posts; 
                }
            },
            error => {
                console.log(<any>error);
            }
		    );
	  }
}