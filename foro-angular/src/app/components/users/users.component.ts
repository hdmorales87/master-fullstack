import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { global } from '../../services/global';

@Component({
  	selector: 'app-users',
  	templateUrl: './users.component.html',
  	styleUrls: ['./users.component.css'],
  	providers: [ UserService ]
})

export class UsersComponent implements OnInit {

	public page_title: string;
	public users: User[];
	public url: string;

  	constructor(
  		private _userService: UserService,
		private _router: Router,
		private _route: ActivatedRoute
  	){
  		this.page_title = 'Compañeros';
  		this.url = global.url;
  		this.users = [];
  	}

  	ngOnInit(): void {
  		this.getUsers();
  	}

  	getUsers(){
  		this._userService.getUsers().subscribe(
            response => {
                if(response.users){
                    this.users = response.users;
                    console.log(this.users);
                }
                else{                	
                   	//...
                }                
            },
            error => {               
                console.log(<any>error);
            }
        );
  	}
}