import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { Category } from '../../models/category';

@Component({
  	selector: 'app-category-new',
  	templateUrl: './category-new.component.html',
  	styleUrls: ['./category-new.component.css'],
  	providers:[UserService,CategoryService]
})
export class CategoryNewComponent implements OnInit {

  	public page_title:string;
  	public identity: any;
  	public token: any;
  	public status: string;
  	public category: Category;

  	constructor(
  		  private _route: ActivatedRoute,
  		  private _router: Router,
  		  private _categoryService: CategoryService,
  		  private _userService: UserService  		
  	) { 
  		  this.page_title = "Crear nueva Categoría";
  		  this.status = "";
  		  this.identity = this._userService.getIdentity();    
        this.token = this._userService.getToken();
        this.category = new Category(1,'');
  	}

  	ngOnInit(): void {
  	}

  	onSubmit(form:any){  		
    		this._categoryService.create(this.token,this.category).subscribe(
            response => {
              	if(response.status != 'error'){
              		  this.category = response.category;
              		  this.status = 'success';

              		  this._router.navigate(['/inicio']);
              	}
              	else{
              		  this.status = 'error';
              	}
            },
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
  	}
}