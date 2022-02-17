import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablesComponent } from './tables.component';
import { TablesRoutingModule } from './tables-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

import {RouterModule} from '@angular/router';
import {CommonUiLibModule, AppTablesModule} from 'common-ui';
import {AppCommonModule} from '../_component/app-common.module';
import { TableGridComponent } from './table-grid/table-grid.component';
import { OpenSessionsComponent } from './open-sessions/open-sessions.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  imports: [
    CommonModule,
    TablesRoutingModule,
    CommonUiLibModule,
    AppCommonModule,
    AppTablesModule,
    ScrollingModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [OpenSessionsComponent],
  exports: [RouterModule],
  declarations: [TablesComponent, TableGridComponent, OpenSessionsComponent]
})
export class TablesModule { }
