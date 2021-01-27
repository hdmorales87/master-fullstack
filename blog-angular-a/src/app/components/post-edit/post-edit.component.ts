import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post';
import { global } from '../../services/global';

@Component({
  	selector: 'post-edit',
 	templateUrl: '../post-new/post-new.component.html',
  	styleUrls: ['../post-new/post-new.component.css'],
  	providers: [UserService, PostService, CategoryService]
})
export class PostEditComponent implements OnInit {

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
  		this.page_title = 'Editar entrada';     
        this.resetVar = false;   
  		this.identity = this._userService.getIdentity(); 
        this.url = global.url;
        this.post = new Post();    
        this.token = this._userService.getToken();            
        this.status = "";   
        this.statusImage = "";  
        this.is_edit = true;
  	}

  	ngOnInit(): void {
        this.getCategories(); 
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
                        //redirigir si no e s el usuario
                        if(this.post.user_id != this.identity.sub){
                            this._router.navigate(['inicio']);
                        }                                                   
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
        this._postService.update(this.token,this.post, this.post.id).subscribe(
            response => {
                if(response.status == "success"){                    
                    this.status = 'success';
                    //redirigir a la pagina del post
                    this._router.navigate(['/entrada',this.post.id]);
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