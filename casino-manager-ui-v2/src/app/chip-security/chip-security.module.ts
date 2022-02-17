import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipSecurityComponent } from './chip-security-home/chip-security.component';

import { ChipSecurityRoutingModule } from './chip-security-routing.module';
import {AppTablesModule, CommonUiLibModule} from 'common-ui';
import {AppCommonModule} from '../_component/app-common.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { ComparescansComponent } from './comparescans/comparescans.component';
import { ComparescansComparisonComponent } from './comparescans-comparison/comparescans-comparison.component';
import { ConfirmationBoxComponent } from '../common/confirmation-box/confirmation-box.component';
import { ChipDetailsComponent } from './chip-details/chip-details.component';
import {DatePipe} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    CommonUiLibModule,
    ChipSecurityRoutingModule,
    AppCommonModule,
    MatSortModule,
    AppTablesModule,
    MatProgressSpinnerModule
  ],
 // exports: [RouterModule],
  declarations: [ChipSecurityComponent,
                 ComparescansComponent,
                 ComparescansComparisonComponent,
                 ConfirmationBoxComponent,
                 ChipDetailsComponent],
  entryComponents: [ConfirmationBoxComponent],
  providers: [DatePipe]
})
export class ChipSecurityModule { }


