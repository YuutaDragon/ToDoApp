import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewDidLeave, ViewWillLeave } from '@ionic/angular';
import { Task } from '../../models/task';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.page.html',
  styleUrls: ['./to-do.page.scss'],
})
export class ToDoPage implements OnInit, OnDestroy{


  listTasks:Task[] = []
  listDoing:Task[] = [];
  listCompleted:Task[] = [];

  tasks: Task[];
  boardId: string;



  constructor(private api: ApiService, private router: Router) { }

  /*Necessario fazer uma chamada de api para recuperar as tasks de um plano selecionado - boardId salvo no localStorage*/
  ngOnInit() {
    this.boardId = JSON.parse(localStorage.getItem('boardId'));

    this.api.listTasks(this.boardId).subscribe(data => {
      this.tasks = data.tasks;

      this.tasks.forEach(element => {
        switch(element.status){
          case 'tasks':
            this.listTasks.push(element);
            break;

          case 'doing':
            this.listDoing.push(element);
            break;

          case 'completed':
            this.listCompleted.push(element);
            break;

          default:
            break;
        }          
      });
    });

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy(){
    this.updateTasks();
  }

  updateTasks(){
    this.listTasks.forEach(element => {    
      if(element.status != 'tasks'){
        element.status = 'tasks'; 

        this.api.updateStatusTask(element).subscribe(data => {console.log(data)});
      }  
    });
    this.listDoing.forEach(element => {    
      if(element.status != 'doing'){
        element.status = 'doing';
        this.api.updateStatusTask(element).subscribe(data => {console.log(data)});
      }  
    });
    this.listCompleted.forEach(element => {    
      if(element.status != 'completed'){
        element.status = 'completed';
        this.api.updateStatusTask(element).subscribe(data => {console.log(data)}); 
      }
    });
  }


  drop(event: CdkDragDrop<string[]>) {
    if(event.previousContainer === event.container){
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);    
    }else{
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    //this.updateTasks();
  }

}
