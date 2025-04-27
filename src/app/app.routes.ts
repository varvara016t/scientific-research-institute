import { Routes } from '@angular/router';
import { TopicsComponent } from './components/topics/topics.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { ContractsComponent } from './components/contracts/contracts.component';

export const routes: Routes = [
  { path: '', component: TopicsComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'contracts', component: ContractsComponent },
  { path: '**', redirectTo: '' }
];