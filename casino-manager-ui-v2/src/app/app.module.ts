import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TopSubnavDataBarComponent} from './topsubnav-data-bar/topsubnav-data-bar.component';
// import {AppTabbedBarComponent} from './app-tabbed-bar/app-tabbed-bar.component';
import {
  AppAddNodeTopologyComponent, AppMenuComponent, CommonUiLibModule, JwtInterceptorService, TopologyTreeModule,
  AppTablesModule, MaterialComponentModule
} from 'common-ui';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {AppService} from './app.service';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {AlertBoxComponent} from './common/alert-box/alert-box.component';
import {DialogBoxComponent} from './common/dialog-box/dialog-box.component';
import {DatePipe} from '@angular/common';
import {AppCommonModule} from './_component/app-common.module';
import {NumberOnlyDirective} from './directive/number-only.directive';
import {ChangeStatusComponent} from './_component/promotion-winner/change-status/change-status.component';
import {PrintWindowWinnerComponent} from './_component/promotion-winner/print-window/print-window.component';
import {PromotionVoucherDetailsComponent} from './_component/promotion-winner/promotion-voucher-details/promotion-voucher-details.component';
import {PrintWindowErrorComponent} from './_component/promotion-winner/print-window-error/print-window-error.component';

@NgModule({
  declarations: [
    AppComponent,
    TopSubnavDataBarComponent,
    AlertBoxComponent,
    DialogBoxComponent,
    NumberOnlyDirective,
    ChangeStatusComponent,
    PrintWindowWinnerComponent,
    PrintWindowErrorComponent,
    PromotionVoucherDetailsComponent
  ],
  imports: [
    BrowserModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '',
      level: NgxLoggerLevel.LOG,
      serverLogLevel: NgxLoggerLevel.OFF,
      disableConsoleLogging: false
    }),
    AppRoutingModule,
    CommonUiLibModule,
    AppTablesModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MaterialComponentModule,
    TopologyTreeModule,
    AppCommonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    }),
    MatFormFieldModule,
    MatInputModule
  ],
  entryComponents: [AppMenuComponent,
                    AppAddNodeTopologyComponent,
                    AlertBoxComponent,
                    DialogBoxComponent,
                    ChangeStatusComponent,
                    PrintWindowWinnerComponent,
                    PrintWindowErrorComponent,
                    PromotionVoucherDetailsComponent],
  exports: [RouterModule],
  providers: [
    DatePipe,
    AppService,
    {provide: 'appName', useValue: 'CASINO_MANAGER'}
    /*,{
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }*/],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function tokenGetter() {
  const authValues: any = JSON.parse(localStorage.getItem('authValues'));
  if (authValues) {
    return localStorage.getItem(authValues.jwtTokenKey);
  }

}
