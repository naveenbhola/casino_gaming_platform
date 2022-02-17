import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChipSecurityComponent } from './chip-security-home/chip-security.component';
import {ComparescansComparisonComponent} from './comparescans-comparison/comparescans-comparison.component';
import {ComparescansComponent} from './comparescans/comparescans.component';
import {AuthGuard} from 'common-ui';
import {ChipDetailsComponent} from './chip-details/chip-details.component';

const routes: Routes = [
  {
    path: ':gamingDay',
    component: ChipSecurityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':gamingDay/comparescans',
    component: ComparescansComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':gamingDay/comparescans/compare',
    component: ComparescansComparisonComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':gamingDay/comparescans/compare/chipdetail',
    component: ChipDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChipSecurityRoutingModule { }
