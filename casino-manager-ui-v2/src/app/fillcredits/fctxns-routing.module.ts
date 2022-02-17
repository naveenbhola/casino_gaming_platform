import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FctxnsComponent } from './fctxns.component';


import {AuthGuard} from 'common-ui';

const routes: Routes = [
  { path: ':gamingDay', component: FctxnsComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class FctxnsRoutingModule { }
