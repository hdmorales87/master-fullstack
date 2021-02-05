import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from '../../models/topic';
import { TopicService } from '../../services/topic.service';

@Component({
  	selector: 'app-topics',
  	templateUrl: './topics.component.html',
  	styleUrls: ['./topics.component.css'],
  	providers: [ TopicService ]
})
export class TopicsComponent implements OnInit {

  	public page_title: string;
  	public topics: Topic[];
  	public totalPages: number;
  	public number_pages: any;
  	public page: number;
  	public next_page: number;
  	public prev_page: number;
    public no_paginate: boolean;	

  	constructor(  		
  		  private _topicService: TopicService,  		
    		private _router: Router,
    		private _route: ActivatedRoute
  	){ 
        this.no_paginate = false;
    		this.number_pages = [];
    		this.page_title = 'Temas';
    		this.totalPages = 0;
    		this.page = 0;
    		this.next_page = 0;
    		this.prev_page = 0;
    		this.topics = [];
  	}

  	ngOnInit(): void {
    		this._route.params.subscribe(params => {
      			var page = +params['page'];
      			if(!page){
        				page = 1;
        				this.prev_page = 1;
        				this.next_page = 2;
      			}
      			this.getTopics(page);
        });  		
  	}

  	getTopics(page = 1){
  		  this._topicService.getTopics(page).subscribe(
            response => {
                if(response.topics){                	
                  	this.topics = response.topics.docs;                  	

                  	//Navegación de Paginación
                  	this.totalPages = response.totalPages; 

                  	//Cargar arreglo con las paginas
                  	var number_pages = [];
                  	for(var i = 1; i <= this.totalPages; i++){
                  		  number_pages.push(i); 
                  	}

                  	this.number_pages = number_pages;

                  	if(page >= 2){
                  		  this.prev_page = page-1;
                  	}
                  	else{
                  		  this.prev_page = 1;
                  	}

                  	if(page < this.totalPages){
                  		  this.next_page = page+1;
                  	}
                  	else{
                  		  this.next_page = this.totalPages;
                  	}
                }
                else{    
                   	this._router.navigate(['/inicio']);
                }                
            },
            error => {                
                console.log(<any>error);
            }
        );
  	}
}