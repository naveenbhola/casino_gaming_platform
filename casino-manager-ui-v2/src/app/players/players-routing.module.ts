import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersComponent } from './players.component';


import {AuthGuard} from 'common-ui';

const routes: Routes = [
  { path: '', component: PlayersComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PlayersRoutingModule { }
