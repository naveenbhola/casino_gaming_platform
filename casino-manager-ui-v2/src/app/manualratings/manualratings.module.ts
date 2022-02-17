import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualratingsComponent } from './manualratings.component';
import { ManualratingsRoutingModule } from './manualratings-routing.module';

import {RouterModule} from '@angular/router';
import {AppTablesModule, CommonUiLibModule} from 'common-ui';
import {AppCommonModule} from '../_component/app-common.module';


@NgModule({
  imports: [
    CommonModule, ManualratingsRoutingModule, CommonUiLibModule, AppCommonModule, AppTablesModule
  ],
  entryComponents: [],
  exports: [RouterModule],
  declarations: [ManualratingsComponent]
})
export class ManualratingsModule { }
