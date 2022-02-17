import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualratingsComponent } from './manualratings.component';


import {AuthGuard} from 'common-ui';

const routes: Routes = [
  { path: ':gamingDay', component: ManualratingsComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ManualratingsRoutingModule { }
