import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {AppTablesModule, CommonUiLibModule, MaterialComponentModule} from 'common-ui';
import {TopologyTreeModule} from 'common-ui';
import {PlayerSearchComponent} from './player-search/player-search.component';
import {RouterModule} from '@angular/router';
import {TabsComponent} from './tabs/tabs.component';
import {TopologyTreeComponent} from './topology-tree/topology-tree.component';
import {ActionMenuComponent} from './action-menu/action-menu.component';
import {DisplaySearchResultComponent} from './display-search-result/display-search-result.component';
import {UserSearchComponent} from './user-search/user-search.component';
import {RollTimeComponent} from './roll-time/roll-time.component';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {HostCallComponent} from './host-call/host-call.component';
import {CreateVirtualGroupComponent} from './create-virtual-group/create-virtual-group';
import {AdjustRatingOptionsComponent} from './adjust-rating-options/adjust-rating-options.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {NotesComponent} from './notes/notes.component';
import {ManualRatingComponent} from './manual-rating-form/manual-rating.component';
import {AppAutoFocusDirective} from './directive/app-auto-focus.directive';
import {NumberOnlyDirective} from './directive/number-only.directive';
import {PromotionWinnerComponent} from './promotion-winner/promotion-winner.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonUiLibModule,
    TopologyTreeModule,
    AppTablesModule,
    MaterialComponentModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [DisplaySearchResultComponent, RollTimeComponent, HostCallComponent, NotesComponent,
    ManualRatingComponent, AdjustRatingOptionsComponent, PromotionWinnerComponent, CreateVirtualGroupComponent],
  exports: [TabsComponent, TopologyTreeComponent, ActionMenuComponent, PlayerSearchComponent,
    DisplaySearchResultComponent, UserSearchComponent, RollTimeComponent, NotesComponent,
    AppAutoFocusDirective, PromotionWinnerComponent, CreateVirtualGroupComponent],
  declarations: [TabsComponent, TopologyTreeComponent, ActionMenuComponent, PlayerSearchComponent,
    DisplaySearchResultComponent, UserSearchComponent, RollTimeComponent, HostCallComponent,
    NotesComponent, ManualRatingComponent, AppAutoFocusDirective,
    NumberOnlyDirective, AdjustRatingOptionsComponent, PromotionWinnerComponent, CreateVirtualGroupComponent],
  providers: [DatePipe]
})
export class AppCommonModule {
}
