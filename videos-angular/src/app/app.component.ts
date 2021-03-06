import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.css'],
  	providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{

  	public title = 'videos-angular';
  	public identity: any;
  	public token: any; 

  	constructor(
  		  private _userService: UserService        
  	){
       
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
}
