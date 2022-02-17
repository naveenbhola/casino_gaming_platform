import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';

import {RouterModule} from '@angular/router';
import {CommonUiLibModule, TopologyTreeModule} from 'common-ui';
import {AppCommonModule} from '../_component/app-common.module';
import { TopWinningLossingComponent } from './top-winning-lossing/top-winning-lossing.component';

@NgModule({
  imports: [
    CommonModule,
    OverviewRoutingModule,
    CommonUiLibModule,
    TopologyTreeModule,
    AppCommonModule
  ],
  entryComponents: [],
  exports: [RouterModule],
  declarations: [OverviewComponent, TopWinningLossingComponent]
})
export class OverviewModule { }
