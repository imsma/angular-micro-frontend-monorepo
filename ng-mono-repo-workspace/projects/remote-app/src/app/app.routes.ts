import { Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo-remote',
    pathMatch: 'full',
  },
  {
    path: 'todo-remote',
    component: TodoListComponent,
  },
];
