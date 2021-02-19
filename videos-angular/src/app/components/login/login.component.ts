import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
  	providers: [UserService]
})
export class LoginComponent implements OnInit {

	public page_title: string;
	public user: User;
	public status: string;
	public identity: any;
	public token: any;

	constructor(
		private _userService: UserService,
		private _router: Router,
		private _route: ActivatedRoute 
	){ 
		this.status = '';
		this.page_title = "Identifícate";
		this.user = new User(1, '', '', '', '', 'ROLE_USER', '', '');
	}

	ngOnInit(): void {
		//Se ejecuta siempre y cierra sesión solo cuando le llega el parametro sure por la URL
		this.logout();
	}

	onSubmit(form:any){
		//Conseguir objeto completo del usuario logueado
		this._userService.signup(this.user).subscribe(
  			response => {
				if(!response.status || response.status != 'error'){
  					this.status = 'success';
  					//Guardamos el usuario en una propiedad
  					this.identity = response; 
  					// //Conseguir el token del usuario identificado
  					this._userService.signup(this.user, true).subscribe(
  			  			response => {
			  				if(!response.status || response.status != 'error'){
			  					//Guardar el token del usuario en una propiedad
			  					this.token = response;
			  					localStorage.setItem('token', this.token);
			  					localStorage.setItem('identity', JSON.stringify(this.identity));
			  					//Redireccionar a inicio
			  					this.status = 'success';
			  					this._router.navigate(['/inicio']);
			  				}
			  				else{
			  					this.status = 'error';
			  				}  				
  			  			},
  			  			error => {
			  				this.status = 'error';
			  				console.log(error);
  			  			}
			  		); 
				}
				else{
					  this.status = 'error';
				}  				 				
  			},
  			error => {
  				  this.status = 'error';
  				  console.log(error);
  			}
		); 
  	}

  	logout(){
		this._route.params.subscribe(params => {
			let logout = +params['sure'];			
			if(logout == 1){
				localStorage.removeItem('identity');
				localStorage.removeItem('token');

				this.identity = null;
				this.token = null;

				//Redirección a inicio
				this._router.navigate(['inicio']);
			}
		});
	}
}