import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { global } from '../../services/global';

@Component({
  	selector: 'post-new',
 	templateUrl: './post-new.component.html',
  	styleUrls: ['./post-new.component.css'],
  	providers: [UserService, PostService, CategoryService]
})

export class PostNewComponent implements OnInit {

  	public page_title : string;
  	public identity: any;
    public status:string;
    public statusImage: string; 
    public resetVar: boolean; 
  	public token: any; 
    public url:string;
  	public post:Post;
    public categories:any;
    public is_edit:boolean; 

    public froala_options:Object = {
        charCounterCount: true,
        language : 'es',
        toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
        toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
        toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
        toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
    };

    public afuConfig:any = {
        multiple: false,
        formatsAllowed: ".jpg,.png,.gif,.jpeg",
        maxSize: "50",
        uploadAPI: {
            url:global.url+'post/upload',
            method:"POST",
            headers: {          
            "Authorization" : this._userService.getToken()
          },                  
        },
        theme: "attachPin",
        hideProgressBar: false,
        hideResetBtn: true,
        hideSelectBtn: false,
        fileNameIndex: true,
        replaceTexts: {
            selectFileBtn: 'Select Files',
            resetBtn: 'Reset',
            uploadBtn: 'Upload',
            dragNDropBox: 'Drag N Drop',
            attachPinBtn: 'Sube tu avatar de usuario',
            afterUploadMsg_success: 'Successfully Uploaded !',
            afterUploadMsg_error: 'Upload Failed !',
            sizeLimit: '50Mb'
        }
    };

  	constructor(
  		private _route: ActivatedRoute,
  		private _router: Router,
  		private _userService: UserService,
  		private _categoryService: CategoryService,
  		private _postService: PostService
  	){ 
  		this.page_title = 'Crear una entrada';     
        this.resetVar = false;  
        this.is_edit = false; 
  		this.identity = this._userService.getIdentity(); 
        this.url = global.url;
        this.post = new Post(1,this.identity.sub,1,'','','',null);    
        this.token = this._userService.getToken();            
        this.status = "";   
        this.statusImage = "";  
  	}

  	ngOnInit(): void {
        this.getCategories();        
  	}    

    getCategories(){
        this._categoryService.getCategories().subscribe(
            response => {
                if(response.status == "success"){
                    this.categories = response.categories;                    
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    imageUpload(datos:any){
        //obtener el objeto response
        let image_data = datos.body;    
        if(image_data.status == 'success'){
            this.post.image = image_data.image;
            this.statusImage = image_data.status;
        } 
        else{
            this.statusImage = 'error';
        } 
    }

    onSubmit(form:any){
        this._postService.create(this.token,this.post).subscribe(
            response => {
                if(response.status == "success"){
                    this.post = response.post;
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