import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  	selector: 'app-post-detail',
  	templateUrl: './post-detail.component.html',
  	styleUrls: ['./post-detail.component.css'],
  	providers: [PostService]
})
export class PostDetailComponent implements OnInit {

	  public page_title : string;
	  public post: any;

  	constructor(
  		  private _postService: PostService,
  		  private _route: ActivatedRoute, 
  		  private _router: Router  	 		
  	) { 
  		  this.post = null;
  		  this.page_title = 'Crear una entrada'; 
  	}

  	ngOnInit(): void {
  		  this.getPost();  		
  	}

  	getPost(){
    		//sacar el id del post de la url
    		this._route.params.subscribe(params => {
      			let id = +params['id'];

      			//peticion ajax para sacar los datos del post
      			this._postService.getPost(id).subscribe(
        				response => {
        					 if(response.status == 'success'){
        						  this.post = response.post;  						
        					 }
        					 else{
        						  this._router.navigate(['inicio']);
        					 }
        				},
        				error => {
  	                console.log(<any>error);
  	                this._router.navigate(['inicio']);
      	        }
      			);  			
    		});  		  
  	}
}