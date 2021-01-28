import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  	selector: 'app-category-detail',
  	templateUrl: './category-detail.component.html',
  	styleUrls: ['./category-detail.component.css'],
  	providers: [ CategoryService,UserService ]
})

export class CategoryDetailComponent implements OnInit {

  	/*public page_title: string;*/
  	public category: Category;
  	public posts:any;
  	public url:string;
  	public identity:any;
  	public token:any;

   	constructor(
   		  private _route: ActivatedRoute,
    		private _router: Router,
    		private _categoryService: CategoryService,    		
    		private _userService: UserService
   	){
   		  this.url = global.url;
   		  this.category = new Category(1,'');
   		  this.identity = this._userService.getIdentity();
  		  this.token = this._userService.getToken();	 
   	}

  	ngOnInit(): void {
  		  this.getPostByCategory();
  	}

  	getPostByCategory(){
        this._route.params.subscribe(params => {
            let id = +params['id'];

            //peticion ajax para sacar los datos de la categoría
            this._categoryService.getCategory(id).subscribe(
                response => {
                    if(response.status == 'success'){
                        this.category = response.category; 
                        //obtener los post de la categoria
                        this._categoryService.getPosts(this.category.id).subscribe(
                          	response => {
                          		if(response.status == 'success'){
                          			this.posts = response.posts;                        			
                          		}
                          		else{
  			                        this._router.navigate(['inicio']);
  			                    }
                          	},
                          	error => {
                          		console.log(<any>error);
                          	}
                      	);                        
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