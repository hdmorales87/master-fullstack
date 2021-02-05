import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from '../../models/topic';
import { Comment } from '../../models/comment';
import { TopicService } from '../../services/topic.service';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { global } from '../../services/global';

@Component({
  	selector: 'app-topic-detail',
  	templateUrl: './topic-detail.component.html',
  	styleUrls: ['./topic-detail.component.css'],
  	providers: [ TopicService, UserService, CommentService ]
})
export class TopicDetailComponent implements OnInit {

  	public page_title: string;
  	public topic: any;
  	public url:string;
  	public comment: Comment;
  	public identity;
  	public token;
  	public status: string;  
  	public statusDel: string;		

  	constructor(  		
  		  private _topicService: TopicService, 
  		  private _userService: UserService,
  		  private _commentService: CommentService,  		
    	  private _router: Router,
    	  private _route: ActivatedRoute
  	){ 
  		  this.page_title = 'Temas';
  		  this.status = "";
  		  this.statusDel = "";  		
  		  this.url = global.url;	
  		  this.identity = this._userService.getIdentity();

        if(this.identity == null){
            this.comment = new Comment('', '', '', null);
        }
        else{
            this.comment = new Comment('', '', '', this.identity._id);
        }        

        this.token = this._userService.getToken();        
  	}

  	ngOnInit(): void {
  		  this.getTopic(); 
  	}

  	getTopic(){
    		this._route.params.subscribe((params: Params) => {
      			//obtener 
      			let id = params['id'];

      			this._topicService.getTopic(id).subscribe(
      	  			response => {
        	  				if(!response.topic){
        	  					  this._router.navigate(['/inicio']);	  					
        	  				}
        	  				else{	  					
        	  					  this.topic = response.topic;
        	  				}
      	  			},
      	  			error => {	  				
      	  				  console.log(<any>error);
      	  			}
    	  		);
    		});  		
  	}

  	onSubmit(form: any){  		
    		this._commentService.add(this.token, this.comment, this.topic._id).subscribe(
      			response => {  				
        				if(!response.topic){
        					 this.status = 'error';  					  					
        				}
        				else{
          					this.status = 'success';
          					this.topic = response.topic;
          					form.reset();
        				}
      			},
      			error => {	
        				this.status = 'error';
        				console.log(<any>error);
      			}
    		);
  	}

  	deleteComment(id: any){
    		this._commentService.delete(this.token, this.topic._id, id).subscribe(
      			response => {  				
        				if(!response.topic){
        					  this.statusDel = 'error';  					  					
        				}
        				else{
        					  this.statusDel = 'success';
        					  this.topic = response.topic;  					
        				}
      			},
      			error => {	
        				this.statusDel = 'error';
        				console.log(<any>error);
      			}
    		);
  	}
}