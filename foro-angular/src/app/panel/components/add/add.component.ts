import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from '../../../models/topic';
import { UserService } from '../../../services/user.service';
import { TopicService } from '../../../services/topic.service';

@Component({
  	selector: 'app-add',
  	templateUrl: './add.component.html',
  	styleUrls: ['./add.component.css'],
  	providers: [UserService, TopicService]
})

export class AddComponent implements OnInit {

	  public page_title: string;
	  public topic: Topic;
	  public token:any;
	  public identity:any;
	  public status: string;
    public is_edit: boolean;

  	constructor(
  		  private _userService: UserService,
  		  private _topicService: TopicService,  		
		    private _router: Router,
		    private _route: ActivatedRoute
  	){
  		  this.page_title = 'Crear nuevo tema';
  		  this.status = '';
        this.is_edit = false;
  		  this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
  		  this.topic = new Topic('','','','','','', this.identity._id, null);
  	}

  	ngOnInit(): void {
  		  console.log(this._topicService.prueba());
    }

 	  onSubmit(form: any){
     		this._topicService.addTopic(this.token, this.topic).subscribe(
            response => {
                if(!response.topic){
                    this.status = 'error';
                }
                else{
                	this.status = 'success';
                   	this.topic = response.topic;
                   	this._router.navigate(['/panel']);
                }                
            },
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
 	  }
}