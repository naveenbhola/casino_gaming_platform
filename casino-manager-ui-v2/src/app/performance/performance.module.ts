import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceComponent } from './performance.component';
import { PerformanceRoutingModule } from './performance-routing.module';

import {RouterModule} from '@angular/router';
import {CommonUiLibModule, AppTablesModule} from 'common-ui';
import {AppCommonModule} from "../_component/app-common.module";


@NgModule({
  imports: [
    CommonModule, PerformanceRoutingModule, CommonUiLibModule, AppCommonModule, AppTablesModule
  ],
  entryComponents: [],
  exports: [RouterModule],
  declarations: [PerformanceComponent]
})
export class PerformanceModule { }
