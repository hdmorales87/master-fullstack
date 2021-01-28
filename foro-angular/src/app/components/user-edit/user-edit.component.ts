import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  	selector: 'app-user-edit',
  	templateUrl: './user-edit.component.html',
  	styleUrls: ['./user-edit.component.css'],
  	providers: [UserService]
})
export class UserEditComponent implements OnInit {

  	public page_title: string;
  	public status: string;
  	public user: User;
	public token:any;
	public identity:any;
	public statusImage: string;
	public url:string;	
	public afuConfig:any;
	public resetVar: boolean;   

  	constructor(
  		private _userService: UserService,
		private _router: Router,
		private _route: ActivatedRoute
  	){
  		this.status = '';
  		this.url = global.url;
  		this.resetVar = false;
  		this.statusImage = "";
  		this.page_title = 'Ajustes de usuario';
  		this.identity = this._userService.getIdentity();    
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.afuConfig = {
		    multiple: false,
		    formatsAllowed: ".jpg,.png,.gif,.jpeg",
		    maxSize: "50",
		    uploadAPI: {
		      	url: this.url+'upload-avatar',
		      	method: "POST",
		      	headers: {	     		
		     		"Authorization" : this.token
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
  	}

  	ngOnInit(): void {
  	}

  	onSubmit(form:any){
  		this._userService.update(this.user).subscribe(
            response => {
                if(!response.user){
                    this.status = 'error';
                }
                else{
                	this.status = 'success';
                   	localStorage.setItem('identity',JSON.stringify(this.user)); 
                }                
            },
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
  	}

  	avatarUpload(datos:any){
		let data = datos.body;		
		if(data.status == 'success'){
			this.user.image = data.user.image;
			this.statusImage = data.status;
		}	
		else{
			this.statusImage = 'error';
		}	
	}

}