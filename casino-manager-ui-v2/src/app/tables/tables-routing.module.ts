import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablesComponent } from './tables.component';


import {AuthGuard} from 'common-ui';

const routes: Routes = [
  { path: ':gamingDay', component: TablesComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TablesRoutingModule { }
