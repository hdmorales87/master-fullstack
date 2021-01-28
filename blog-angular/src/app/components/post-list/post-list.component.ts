import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  	selector: 'post-list',
  	templateUrl: './post-list.component.html',
  	styleUrls: ['./post-list.component.css'],
    providers: [PostService]
})
export class PostListComponent implements OnInit {	  

    //Recibir datos de un componente padre
	  @Input() posts: any;
	  @Input() identity: any;
    @Input() token: any;
	  @Input() url: any;	

  	constructor(
        private _postService: PostService
    ) { }

  	ngOnInit(): void {
  	}

    getPosts(){
        this._postService.getPosts().subscribe( 
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

  	deletePost(id:any){
		    this._postService.delete(this.token,id).subscribe(	
			      response => {
                this.getPosts();
            },
            error => {
                console.log(<any>error);
            }
		    );
	  }
}