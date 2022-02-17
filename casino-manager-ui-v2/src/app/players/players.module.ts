import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersComponent } from './players.component';
import { PlayersRoutingModule } from './players-routing.module';

import {RouterModule} from '@angular/router';
import {CommonUiLibModule, AppTablesModule} from 'common-ui';
import {AppCommonModule} from '../_component/app-common.module';
import {PlayerGridViewComponent} from './player-grid-view/player-grid-view.component';


@NgModule({
  imports: [
    CommonModule, PlayersRoutingModule, CommonUiLibModule, AppCommonModule, AppTablesModule
  ],
  entryComponents: [],
  exports: [RouterModule],
  declarations: [PlayersComponent, PlayerGridViewComponent]
})
export class PlayersModule { }
