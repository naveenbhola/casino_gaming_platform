import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceComponent } from './performance.component';


import {AuthGuard} from 'common-ui';

const routes: Routes = [
  { path: ':gamingDay', component: PerformanceComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PerformanceRoutingModule { }
