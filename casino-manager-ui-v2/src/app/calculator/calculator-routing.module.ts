import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import {AuthGuard} from 'common-ui';
import {CalculatorComponent} from './calculator.component';

const routes: Routes = [
  { path: '', component: CalculatorComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CalculatorRoutingModule { }
