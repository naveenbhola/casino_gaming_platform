import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenercloserComponent } from './openercloser.component';


import {AuthGuard} from 'common-ui';

const routes: Routes = [
  { path: ':gamingDay', component: OpenercloserComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class OpenercloserRoutingModule { }
