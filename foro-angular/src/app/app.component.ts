import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { global } from './services/global';

@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.css'],
  	providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {

  	public title = 'foro-angular';
    public url: string;
  	public identity: any;
  	public token: any; 
    public search: string;

  	constructor(
  		  private _userService: UserService,
        private _router: Router,
        private _route: ActivatedRoute
  	){
        this.url = global.url; 
        this.search = '';
  		  this.loadUser();
  	}

  	ngOnInit(){
    	  //console.log(this.identity, this.token);        
    }

    ngDoCheck(){
        this.loadUser(); 
    }

    loadUser(){
        this.identity = this._userService.getIdentity();    
        this.token = this._userService.getToken();
    }

    logout(){
        //Limpiar los datos de la sesión
        localStorage.clear();

        //Limpiar las propiedades
        this.identity = null;
        this.token = null;

        //Redirección a inicio
        this._router.navigate(['/inicio']);            
    }

    goSearch(){
        this._router.navigate(['/buscar', this.search]);
    }
}
