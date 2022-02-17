import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenercloserComponent } from './openercloser.component';
import { OpenercloserRoutingModule } from './openercloser-routing.module';

import {RouterModule} from '@angular/router';
import {AppTablesModule, CommonUiLibModule} from 'common-ui';
import {AppCommonModule} from '../_component/app-common.module';
import { OpenerCloserDetailsComponent } from './opener-closer-details/opener-closer-details.component';
import { PrintWindowComponent } from './print-window/print-window.component';


@NgModule({
  imports: [
    CommonModule, OpenercloserRoutingModule, CommonUiLibModule, AppCommonModule, AppTablesModule
  ],
  entryComponents: [OpenerCloserDetailsComponent, PrintWindowComponent],
  exports: [RouterModule],
  declarations: [OpenercloserComponent, OpenerCloserDetailsComponent, PrintWindowComponent]
})
export class OpenercloserModule { }
