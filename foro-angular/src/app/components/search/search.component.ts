import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from '../../models/topic';
import { TopicService } from '../../services/topic.service';

@Component({
  	selector: 'app-search',
  	templateUrl: '../topics/topics.component.html',
  	styleUrls: ['./search.component.css'],
  	providers: [ TopicService ]
})
export class SearchComponent implements OnInit {

  	public page_title: string;
  	public topics: any;
  	public no_paginate: boolean;
  	public number_pages: any;
	public next_page: number;
  	public prev_page: number;

  	constructor(
  		private _topicService: TopicService,  		
    	private _router: Router,
    	private _route: ActivatedRoute
  	) {   		
  		this.no_paginate = true;
  		this.page_title = '';
  		this.number_pages = [];
		this.next_page = 0;
    	this.prev_page = 0;
  	}

  	ngOnInit(): void {
  		this._route.params.subscribe(params => {
  			var search = params['search'];
  			this.page_title = 'Buscar: ' + search;  			
  			this.getTopics(search);
        });
  	}

  	getTopics(search: any){
  		this._topicService.search(search).subscribe(
  			response => {
  				if(response.topics){
  					this.topics = response.topics;
  				}
  			},
  			error => {
  				console.log(<any>error);
  			}
  		);
  	}
}