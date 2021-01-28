import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  	selector: 'app-user-edit',
  	templateUrl: './user-edit.component.html',
  	styleUrls: ['./user-edit.component.css'],
  	providers:[UserService]
})

export class UserEditComponent implements OnInit {

	public page_title: string;
	public user: User;
	public identity: any;
	public token: any;
	public status: string;
	public statusImage: string;	
	public url:string;
	public resetVar: boolean; 
	
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
	      	url:global.url+'user/upload',
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
		private _userService: UserService
	) {
		this.status = "";
		this.statusImage = "";	
		this.url = global.url;	
		this.resetVar = false;
		this.page_title = 'Ajustes de usuario';
		this.user = new User(1,'','','','','ROLE_USER','',''); 		
		this.identity = this._userService.getIdentity();    
        this.token = this._userService.getToken();
        //Rellenar objeto usuario
        this.user = new User(
        	this.identity.sub,
        	this.identity.name,
        	this.identity.surname,
        	this.identity.email,
        	this.identity.password,
        	this.identity.role, 
        	this.identity.description,
        	this.identity.image
        );                
	}

	ngOnInit(): void {

	}

	onSubmit(form:any){
		this._userService.update(this.token,this.user).subscribe(
            response => {
                if(response.status == "success"){
                    this.status = response.status;
                    //Actualizar campos en el localStorage
                    if(response.changes.name){
                    	this.identity.name = response.changes.name;
                    }
                    if(response.changes.surname){
                    	this.identity.surname = response.changes.surname;
                    }
                    if(response.changes.email){
                    	this.identity.email = response.changes.email;
                    }
                    if(response.changes.description){
                    	this.identity.description = response.changes.description;
                    }
                    if(response.changes.image){
                    	this.identity.image = response.changes.image;
                    }
                    localStorage.setItem('identity',JSON.stringify(this.identity));
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

	avatarUpload(datos:any){
		//obtener el objeto response
		let data = datos.body;		
		if(data.status == 'success'){
			this.user.image = data.image;
			this.statusImage = data.status;
		}	
		else{
			this.statusImage = 'error';
		}	
	}
}