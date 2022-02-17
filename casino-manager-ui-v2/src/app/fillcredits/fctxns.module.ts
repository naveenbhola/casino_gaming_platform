import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FctxnsComponent } from './fctxns.component';
import { FctxnsRoutingModule } from './fctxns-routing.module';

import {RouterModule} from '@angular/router';
import {AppTablesModule, CommonUiLibModule} from 'common-ui';
import {AppCommonModule} from '../_component/app-common.module';
import { FillCreditDetailsComponent } from './fill-credit-details/fill-credit-details.component';

@NgModule({
  imports: [
    CommonModule, FctxnsRoutingModule, CommonUiLibModule, AppCommonModule, AppTablesModule
  ],
  entryComponents: [FillCreditDetailsComponent],
  exports: [RouterModule],
  declarations: [FctxnsComponent, FillCreditDetailsComponent]
})
export class FctxnsModule { }
